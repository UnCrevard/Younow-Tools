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
const module_log_1 = require("./Modules/module_log");
const module_db_1 = require("./Modules/module_db");
const dos = require("./Modules/module_promixified");
const module_hls_younow_1 = require("./module_hls_younow");
const module_utils_1 = require("./modules/module_utils");
const module_www_1 = require("./modules/module_www");
const API_URL = "https://api.younow.com";
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
    return module_www_1.getURL(`${API_URL}/php/api/channel/getInfo/channelId=${uid}`);
}
exports.getUserInfoByUID = getUserInfoByUID;
function getLiveBroadcastByUsername(username) {
    return module_www_1.getURL(`${API_URL}/php/api/broadcast/info/user=${username}`);
}
exports.getLiveBroadcastByUsername = getLiveBroadcastByUsername;
function getLiveBroadcastByUID(uid) {
    return module_www_1.getURL(`${API_URL}/php/api/broadcast/info/channelId=${uid}`);
}
exports.getLiveBroadcastByUID = getLiveBroadcastByUID;
function getArchivedBroadcast(bid) {
    return module_www_1.getURL(`${API_URL}/php/api/broadcast/videoPath/broadcastId=${bid}`);
}
exports.getArchivedBroadcast = getArchivedBroadcast;
function getMoments(uid, next) {
    return module_www_1.getURL(`${API_URL}/php/api/moment/profile/channelId=${uid}/createdBefore=${next}`);
}
exports.getMoments = getMoments;
function getTrendings() {
    return module_www_1.getURL(`${API_URL}/php/api/younow/dashboard/locale=${main_1.settings.locale}/trending=50`);
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
                    return moveFile(video_filename);
                });
            })
                .catch(module_log_1.error);
        }
    });
}
exports.downloadArchive = downloadArchive;
function getPlaylist(bid) {
    return module_www_1.getURL(`${API_URL}/php/api/broadcast/videoPath/hls=1/broadcastId=${bid}`, "utf8");
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
                        resolve("ok");
                    });
                    ffmpeg.on("close", code => {
                        resolve("ok");
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
    return module_www_1.getURL(`https://cdn.younow.com/php/api/channel/getFansOf/channelId=${userId}/startFrom=${start}/numberOfRecords=50`);
}
exports.getFollowed = getFollowed;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3lvdW5vdy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL21vZHVsZV95b3Vub3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLGlDQUFpQztBQUdqQyw4QkFBNkI7QUFHN0Isc0NBQXFDO0FBQ3JDLGlEQUErQztBQUMvQyxxREFBd0U7QUFDeEUsbURBQTRDO0FBQzVDLG9EQUFtRDtBQUNuRCwyREFBc0Q7QUFDdEQseURBQStFO0FBQy9FLHFEQUE2QztBQUs3QyxNQUFNLE9BQU8sR0FBRyx3QkFBd0IsQ0FBQTtBQUV4QyxxQkFBNEIsSUFBSTtJQUsvQixJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNoQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQy9CLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUE7S0FDakQ7U0FDSTtRQUNKLE9BQU8sSUFBSSxDQUFBO0tBQ1g7QUFDRixDQUFDO0FBWkQsa0NBWUM7QUFFRCx1QkFBOEIsTUFBZ0Q7SUFDN0UsT0FBTyxHQUFHLE1BQU0sQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFBO0FBQ2hELENBQUM7QUFGRCxzQ0FFQztBQWVELHFCQUE0QixFQUFNLEVBQUUsSUFBcUI7SUFDeEQsSUFBSSxNQUFNLEdBQUcsY0FBYyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUVyQyxJQUFJLE1BQU0sRUFBRTtRQUNYLE1BQU0sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFBO1FBQ3BCLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtLQUM5QjtTQUNJO1FBQ0osSUFBSSxLQUFLLENBQUMsSUFBVyxDQUFDLEVBQUU7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