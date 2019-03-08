"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _path = require("path");
const _progress = require("progress");
const child_process_1 = require("child_process");
const module_log_1 = require("./module_log");
const module_db_1 = require("./module_db");
const dos = require("./module_promixified");
const module_hls_younow_1 = require("../modules/module_hls_younow");
const module_utils_1 = require("./module_utils");
const module_www_1 = require("./module_www");
const API = "https://api.younow.com";
const CDN = "https://cdn.younow.com";
function extractUser(user) {
    if (isNaN(user)) {
        var pos = user.lastIndexOf("/");
        return (pos < 0) ? user : user.substring(pos + 1);
    }
    else {
        return user;
    }
}
exports.extractUser = extractUser;
function errortoString(result) {
    return `${result.errorCode} ${result.errorMsg}`;
}
exports.errortoString = errortoString;
function resolveUser(db, user) {
    let userdb = isUsernameInDB(db, user);
    if (userdb) {
        userdb.errorCode = 0;
        return Promise.resolve(userdb);
    }
    else {
        if (isNaN(user)) {
            return getLiveBroadcastByUsername(user)
                .then(infos => {
                if (infos.errorCode == 0 || infos.errorCode == 206) {
                    return getUserInfoByUID(infos.userId)
                        .then(infos => infos);
                }
                else {
                    return infos;
                }
            });
        }
        else {
            return getUserInfoByUID(user)
                .then(infos => {
                if (infos.userId) {
                    return infos;
                }
                else {
                    infos.errorCode = 101;
                    infos.errorMsg = "Invalid user Id";
                    return infos;
                }
            });
        }
    }
}
exports.resolveUser = resolveUser;
function getUserInfoByUID(uid) {
    return module_www_1.getURL(`${API}/php/api/channel/getInfo/channelId=${uid}`);
}
exports.getUserInfoByUID = getUserInfoByUID;
function getLiveBroadcastByUsername(username) {
    return module_www_1.getURL(`${API}/php/api/broadcast/info/curId=0/user=${username}`);
}
exports.getLiveBroadcastByUsername = getLiveBroadcastByUsername;
function getLiveBroadcastByUID(uid) {
    return module_www_1.getURL(`${API}/php/api/broadcast/info/channelId=${uid}/curId=0`);
}
exports.getLiveBroadcastByUID = getLiveBroadcastByUID;
function getArchivedBroadcast(bid) {
    return module_www_1.getURL(`${API}/php/api/broadcast/videoPath/broadcastId=${bid}`);
}
exports.getArchivedBroadcast = getArchivedBroadcast;
function getMoments(uid, next) {
    return module_www_1.getURL(`${API}/php/api/moment/profile/channelId=${uid}/createdBefore=${next}`);
}
exports.getMoments = getMoments;
function getTrendings() {
    return module_www_1.getURL(`${API}/php/api/younow/dashboard/locale=${global.settings.locale}/trending=50`);
}
exports.getTrendings = getTrendings;
function getTagInfo(tag) {
    return module_www_1.getURL(`https://playdata.younow.com/live/tags/${Buffer.from(tag).toString("base64")}.json`);
}
exports.getTagInfo = getTagInfo;
function downloadArchive(user, bid, started) {
    return __awaiter(this, void 0, void 0, function* () {
        module_log_1.info("downloadArchive", user.profile, bid);
        if (global.settings.noDownload) {
            return true;
        }
        let archive = yield getArchivedBroadcast(bid);
        if (archive.errorCode) {
            module_log_1.error(`${user.profile} ${bid} ${archive.errorCode} ${archive.errorMsg}`);
            return false;
        }
        let fix = archive;
        fix.dateStarted = started || (new Date(archive.broadcastTitle).getTime() / 1000);
        fix.profile = user.profile;
        fix.broadcastId = bid;
        fix.country = user.country;
        fix.awsUrl = archive.broadcastThumbnail;
        let video_filename = createFilename(archive) + "." + global.settings.videoFormat;
        saveJSON(archive).catch(module_log_1.error);
        downloadThumbnail(archive).catch(module_log_1.error);
        let exists = yield dos.exists(video_filename);
        if (!exists) {
            return module_www_1.getURL(archive.hls, "utf8")
                .then((playlist) => {
                let m = playlist.match(/\d+\.ts/g);
                if (!m) {
                    module_log_1.error(playlist);
                    return false;
                }
                let total_segment = m.length;
                m = archive.hls.match(/(https:.+)playlist.m3u8/i);
                if (!m) {
                    module_log_1.error(archive.hls);
                    return false;
                }
                let url = m[1];
                let bar = new _progress(`${user.profile} ${bid} :bar :percent :elapseds/:etas :rate/bps`, {
                    total: total_segment,
                    width: 20,
                    complete: "●",
                    incomplete: "○",
                    clear: true
                });
                return module_hls_younow_1.downloadSegments(global.settings, url, video_filename, total_segment, bar, false)
                    .then(err => {
                    dos.timeout(10000)
                        .then(err => {
                        return moveFile(video_filename);
                    })
                        .catch(module_log_1.error);
                });
            })
                .catch(module_log_1.error);
        }
        else {
            return false;
        }
    });
}
exports.downloadArchive = downloadArchive;
function getPlaylist(bid) {
    return module_www_1.getURL(`${API}/php/api/broadcast/videoPath/hls=1/broadcastId=${bid}`, "utf8");
}
exports.getPlaylist = getPlaylist;
function downloadThemAll(live) {
    return __awaiter(this, void 0, void 0, function* () {
        if (global.settings.noDownload) {
            return [true, true, true];
        }
        else {
            return Promise.all([saveJSON(live), downloadThumbnail(live), downloadLiveStream(live)]);
        }
    });
}
exports.downloadThemAll = downloadThemAll;
function downloadLiveStream(live) {
    return __awaiter(this, void 0, void 0, function* () {
        if (live.errorCode == 0) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let filename = createFilename(live) + "." + global.settings.videoFormat;
                let exists = yield dos.exists(filename);
                if (!exists) {
                    let params = `-i rtmp://${live.media.host}${live.media.app}/${live.media.stream} ${global.settings.useFFMPEG} ${filename}`.split(" ");
                    let ffmpeg = child_process_1.spawn("ffmpeg", params);
                    ffmpeg.on("error", err => {
                        reject(err);
                    });
                    ffmpeg.on("exit", code => {
                        if (code) {
                            module_log_1.error(`FFMPEG exit ${code}`);
                        }
                    });
                    ffmpeg.on("close", code => {
                        moveFile(filename).
                            then(err => {
                            resolve("ok");
                        })
                            .catch(err => {
                            reject(err);
                        });
                    });
                    ffmpeg.stderr.on("data", data => {
                    });
                    ffmpeg.stdin.on("error", err => err);
                }
            }));
        }
        else {
            return Promise.reject(live.errorMsg);
        }
    });
}
exports.downloadLiveStream = downloadLiveStream;
function downloadThumbnail(live) {
    return __awaiter(this, void 0, void 0, function* () {
        if (live.errorCode == 0) {
            let filename = createFilename(live) + ".jpg";
            let exists = yield dos.exists(filename);
            if (!exists) {
                let image = yield module_www_1.getURL(`https://ynassets.younow.com/broadcastdynamic/live/${live.broadcastId}/${live.broadcastId}.jpg`, null);
                yield dos.writeFile(filename, image);
                yield moveFile(filename);
                module_log_1.info("downloadThumbnail", image.length, filename);
            }
            return true;
        }
        return false;
    });
}
exports.downloadThumbnail = downloadThumbnail;
function saveJSON(live) {
    return __awaiter(this, void 0, void 0, function* () {
        if (live.errorCode == 0) {
            let filename = createFilename(live) + ".json";
            let exists = yield dos.exists(filename);
            if (!exists) {
                yield dos.writeFile(filename, module_log_1.prettify(live));
                yield moveFile(filename);
                module_log_1.info("saveJSON", filename);
            }
            return true;
        }
        return false;
    });
}
exports.saveJSON = saveJSON;
function createFilename(live) {
    let filename = _path.join(global.settings.pathDownload, `${live.country || "XX"}_${live.profile}_${module_utils_1.formatDateTime(new Date((live.dateStarted || live.dateCreated || Date.now() / 1000) * 1000))}_${live.broadcastId}`);
    module_log_1.debug("createFilename", filename);
    return filename;
}
exports.createFilename = createFilename;
function moveFile(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        if (global.settings.pathMove) {
            let newpath = _path.join(global.settings.pathMove, _path.parse(filename).base);
            module_log_1.info("moveFile", filename, newpath);
            return dos.rename(filename, newpath);
        }
    });
}
function getFollowed(userId, start) {
    return module_www_1.getURL(`${API}/php/api/channel/getFansOf/channelId=${userId}/startFrom=${start}/numberOfRecords=50`);
}
exports.getFollowed = getFollowed;
function getOnlineFollowed(follower) {
    return module_www_1.getURL(`${API}/php/api/channel/getLocationOnlineFansOf/channelId=${follower}/numberOfRecords=50`);
}
exports.getOnlineFollowed = getOnlineFollowed;
function convertToUserDB(uid, user) {
    let dbuser = {
        ignore: user.ignore || false,
        comment: user.comment || "---",
        profile: user.profile,
        userId: user.userId || uid,
        firstName: user.firstName,
        lastName: user.lastName,
        country: user.country || "XX",
        state: user.state,
        city: user.city,
        description: user.description,
        twitterId: user.twitterId,
        twitterHandle: user.twitterHandle,
        youTubeUserName: user.youTubeUserName,
        youTubeChannelId: user.youTubeChannelId,
        youTubeTitle: user.youTubeTitle,
        googleId: user.googleId,
        googleHandle: user.googleHandle,
        facebookId: user.facebookId,
        instagramId: user.instagramId,
        instagramHandle: user.instagramHandle,
        facebookPageId: user.facebookId,
        websiteUrl: user.websiteUrl,
        dateCreated: user.dateCreated,
        locale: user.locale,
        language: user.language,
        tumblrId: user.tumblrId
    };
    for (let i in dbuser) {
        if (dbuser[i] === "" || dbuser[i] === null || dbuser[i] === undefined) {
            delete dbuser[i];
        }
    }
    return dbuser;
}
exports.convertToUserDB = convertToUserDB;
function openDB() {
    return new module_db_1.FakeDB().open(global.settings.pathDB, "Broadcasters");
}
exports.openDB = openDB;
function isUsernameInDB(db, user) {
    if (isNaN(user)) {
        var regex = new RegExp("^" + user + "$", "i");
        for (let i of Object.keys(db)) {
            let dbuser = db[i];
            let profile = dbuser.profile;
            if (profile) {
                if (profile.match(regex)) {
                    return dbuser;
                }
            }
        }
        return null;
    }
    else {
        return db[user] || null;
    }
}
exports.isUsernameInDB = isUsernameInDB;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3lvdW5vdy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZHVsZXMvbW9kdWxlX3lvdW5vdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0EsOEJBQTZCO0FBRzdCLHNDQUFxQztBQUNyQyxpREFBK0M7QUFDL0MsNkNBQWdFO0FBQ2hFLDJDQUFvQztBQUNwQyw0Q0FBMkM7QUFDM0Msb0VBQStEO0FBQy9ELGlEQUF1RTtBQUN2RSw2Q0FBcUM7QUFVckMsTUFBTSxHQUFHLEdBQUcsd0JBQXdCLENBQUE7QUFDcEMsTUFBTSxHQUFHLEdBQUcsd0JBQXdCLENBQUE7QUFFcEMscUJBQTRCLElBQUk7SUFLL0IsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDaEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUMvQixPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFBO0tBQ2pEO1NBQ0k7UUFDSixPQUFPLElBQUksQ0FBQTtLQUNYO0FBQ0YsQ0FBQztBQVpELGtDQVlDO0FBRUQsdUJBQThCLE1BQWdEO0lBQzdFLE9BQU8sR0FBRyxNQUFNLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQTtBQUNoRCxDQUFDO0FBRkQsc0NBRUM7QUFlRCxxQkFBNEIsRUFBTSxFQUFFLElBQXFCO0lBQ3hELElBQUksTUFBTSxHQUFHLGNBQWMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFFckMsSUFBSSxNQUFNLEVBQUU7UUFDWCxNQUFNLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQTtRQUNwQixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7S0FDOUI7U0FDSTtRQUNK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