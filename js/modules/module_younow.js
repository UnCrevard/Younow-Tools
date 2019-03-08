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
const P = require("./module_promixified");
const module_hls_younow_1 = require("../modules/module_hls_younow");
const module_hls_1 = require("../module_hls");
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
    return result.errorCode ? `${result.errorCode} ${result.errorMsg}` : result.errorCode;
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
        let exists = yield P.exists(video_filename);
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
                    P.timeout(10000)
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
            return Promise.all([saveJSON(live), downloadThumbnail(live), downloadLiveStreamFix(live)]);
        }
    });
}
exports.downloadThemAll = downloadThemAll;
function downloadLiveStream(live) {
    return __awaiter(this, void 0, void 0, function* () {
        if (live.errorCode == 0) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let filename = createFilename(live) + "." + global.settings.videoFormat;
                let exists = yield P.exists(filename);
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
function downloadLiveStreamFix(live) {
    return __awaiter(this, void 0, void 0, function* () {
        let liveFilenames = [];
        while (true) {
            let broadcast = yield getArchivedBroadcast(live.broadcastId);
            if (broadcast.errorCode == 246) {
                yield P.timeout(60000 * 10);
            }
            else if (broadcast.errorCode == 248) {
                yield P.timeout(60000 * 5);
            }
            else if (broadcast.errorCode == 133) {
                module_log_1.error(`${live.username} (${live.userId} has been banned`);
                return;
            }
            else if (broadcast.errorCode == 0) {
                try {
                    if (!broadcast.videoAvailable || broadcast.noLongerAvailable)
                        throw "video is gone";
                    live["hls"] = true;
                    let replayFilename = createFilename(live) + "." + global.settings.videoFormat;
                    let result = yield module_hls_1.HLS(broadcast.hls, replayFilename, 0, 10);
                    if (result) {
                        yield moveFile(replayFilename).catch(module_log_1.error);
                    }
                }
                catch (err) {
                    module_log_1.error("HLS crash", err);
                }
                return;
            }
            else {
                module_log_1.error(live.profile, errortoString(broadcast));
                return;
            }
        }
    });
}
function downloadThumbnail(live) {
    return __awaiter(this, void 0, void 0, function* () {
        if (live.errorCode == 0) {
            let filename = createFilename(live) + ".jpg";
            let exists = yield P.exists(filename);
            if (!exists) {
                let image = yield module_www_1.getURL(`https://ynassets.younow.com/broadcastdynamic/live/${live.broadcastId}/${live.broadcastId}.jpg`, null);
                yield P.writeFile(filename, image);
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
            let exists = yield P.exists(filename);
            if (!exists) {
                yield P.writeFile(filename, module_log_1.prettify(live));
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
    let filename = _path.join(global.settings.pathDownload, module_utils_1.cleanFilename(global.settings.filenameTemplate
        .replace("service", "Younow")
        .replace("country", live.country || live.locale || "XX")
        .replace("username", live.profile)
        .replace("title", live.title)
        .replace("date", module_utils_1.formatDateTime(new Date((live.dateStarted || live.dateCreated || Date.now() / 1000) * 1000)))
        .replace("bid", live.broadcastId)
        .replace("type", "hls" in live ? "replay" : "live")));
    return filename;
}
exports.createFilename = createFilename;
function moveFile(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        if (global.settings.pathMove) {
            let newpath = _path.join(global.settings.pathMove, _path.parse(filename).base);
            module_log_1.info("moveFile", filename, newpath);
            return P.rename(filename, newpath);
        }
    });
}
exports.moveFile = moveFile;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3lvdW5vdy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZHVsZXMvbW9kdWxlX3lvdW5vdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0EsOEJBQTZCO0FBRzdCLHNDQUFxQztBQUNyQyxpREFBK0M7QUFDL0MsNkNBQWdFO0FBQ2hFLDJDQUFvQztBQUNwQywwQ0FBeUM7QUFDekMsb0VBQStEO0FBQy9ELDhDQUFpQztBQUNqQyxpREFBcUY7QUFDckYsNkNBQXFDO0FBVXJDLE1BQU0sR0FBRyxHQUFHLHdCQUF3QixDQUFBO0FBQ3BDLE1BQU0sR0FBRyxHQUFHLHdCQUF3QixDQUFBO0FBRXBDLHFCQUE0QixJQUFJO0lBSy9CLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ2hCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDL0IsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQTtLQUNqRDtTQUNJO1FBQ0osT0FBTyxJQUFJLENBQUE7S0FDWDtBQUNGLENBQUM7QUFaRCxrQ0FZQztBQUVELHVCQUE4QixNQUFnRDtJQUU3RSxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUEsQ0FBQyxDQUFBLEdBQUcsTUFBTSxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUEsQ0FBQyxDQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUE7QUFDbEYsQ0FBQztBQUhELHNDQUdDO0FBZUQscUJBQTRCLEVBQU0sRUFBRSxJQUFxQjtJQUN4RCxJQUFJLE1BQU0sR0FBRyxjQUFjLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFBO0lBRXJDLElBQUksTUFBTSxFQUFFO1FBQ1gsTUFBTSxDQUFDLFNBQVMsR0FB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