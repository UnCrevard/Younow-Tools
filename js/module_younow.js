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
const main_1 = require("./main");
const _path = require("path");
const _progress = require("progress");
const child_process_1 = require("child_process");
const module_log_1 = require("./modules/module_log");
const module_db_1 = require("./modules/module_db");
const dos = require("./modules/module_promixified");
const module_hls_younow_1 = require("./module_hls_younow");
const module_utils_1 = require("./modules/module_utils");
const module_www_1 = require("./modules/module_www");
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
    return module_www_1.getURL(`${API}/php/api/younow/dashboard/locale=${main_1.settings.locale}/trending=50`);
}
exports.getTrendings = getTrendings;
function getTagInfo(tag) {
    return module_www_1.getURL(`https://playdata.younow.com/live/tags/${Buffer.from(tag).toString("base64")}.json`);
}
exports.getTagInfo = getTagInfo;
function downloadArchive(user, bid, started) {
    return __awaiter(this, void 0, void 0, function* () {
        module_log_1.info("downloadArchive", user.profile, bid);
        if (main_1.settings.noDownload) {
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
        let video_filename = createFilename(archive) + "." + main_1.settings.videoFormat;
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
                return module_hls_younow_1.downloadSegments(main_1.settings, url, video_filename, total_segment, bar, false)
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
        if (main_1.settings.noDownload) {
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
                let filename = createFilename(live) + "." + main_1.settings.videoFormat;
                let exists = yield dos.exists(filename);
                if (!exists) {
                    let params = `-i rtmp://${live.media.host}${live.media.app}/${live.media.stream} ${main_1.settings.useFFMPEG} ${filename}`.split(" ");
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
                let image = yield module_www_1.getURL(live.awsUrl, null);
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
    let filename = _path.join(main_1.settings.pathDownload, `${live.country || "XX"}_${live.profile}_${module_utils_1.formatDateTime(new Date((live.dateStarted || live.dateCreated || Date.now() / 1000) * 1000))}_${live.broadcastId}`);
    module_log_1.debug("createFilename", filename);
    return filename;
}
exports.createFilename = createFilename;
function moveFile(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        if (main_1.settings.pathMove) {
            let newpath = _path.join(main_1.settings.pathMove, _path.parse(filename).base);
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
    return new module_db_1.FakeDB().open(main_1.settings.pathDB, "Broadcasters");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3lvdW5vdy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL21vZHVsZV95b3Vub3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLGlDQUFpQztBQUdqQyw4QkFBNkI7QUFHN0Isc0NBQXFDO0FBQ3JDLGlEQUErQztBQUMvQyxxREFBd0U7QUFDeEUsbURBQTRDO0FBQzVDLG9EQUFtRDtBQUNuRCwyREFBc0Q7QUFDdEQseURBQStFO0FBQy9FLHFEQUE2QztBQVU3QyxNQUFNLEdBQUcsR0FBRyx3QkFBd0IsQ0FBQTtBQUNwQyxNQUFNLEdBQUcsR0FBRyx3QkFBd0IsQ0FBQTtBQUVwQyxxQkFBNEIsSUFBSTtJQUsvQixJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNoQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQy9CLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUE7S0FDakQ7U0FDSTtRQUNKLE9BQU8sSUFBSSxDQUFBO0tBQ1g7QUFDRixDQUFDO0FBWkQsa0NBWUM7QUFFRCx1QkFBOEIsTUFBZ0Q7SUFDN0UsT0FBTyxHQUFHLE1BQU0sQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFBO0FBQ2hELENBQUM7QUFGRCxzQ0FFQztBQWVELHFCQUE0QixFQUFNLEVBQUUsSUFBcUI7SUFDeEQsSUFBSSxNQUFNLEdBQUcsY0FBYyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUVyQyxJQUFJLE1BQU0sRUFBRTtRQUNYLE1BQU0sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFBO1FBQ3BCLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtLQUM5QjtTQUNJO1FB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