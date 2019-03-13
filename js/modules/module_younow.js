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
            return module_hls_1.HLS(archive.hls, video_filename, 0, global.settings.parallelDownloads);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3lvdW5vdy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZHVsZXMvbW9kdWxlX3lvdW5vdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0EsOEJBQTZCO0FBRzdCLHNDQUFxQztBQUVyQyw2Q0FBZ0U7QUFDaEUsMkNBQW9DO0FBQ3BDLDBDQUF5QztBQUN6QyxvRUFBK0Q7QUFDL0QsOENBQWlDO0FBQ2pDLGlEQUFxRjtBQUNyRiw2Q0FBcUM7QUFVckMsTUFBTSxHQUFHLEdBQUcsd0JBQXdCLENBQUE7QUFDcEMsTUFBTSxHQUFHLEdBQUcsd0JBQXdCLENBQUE7QUFFcEMscUJBQTRCLElBQUk7SUFLL0IsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDaEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUMvQixPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFBO0tBQ2pEO1NBQ0k7UUFDSixPQUFPLElBQUksQ0FBQTtLQUNYO0FBQ0YsQ0FBQztBQVpELGtDQVlDO0FBRUQsdUJBQThCLE1BQWdEO0lBRTdFLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQSxDQUFDLENBQUEsR0FBRyxNQUFNLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQSxDQUFDLENBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQTtBQUNsRixDQUFDO0FBSEQsc0NBR0M7QUFlRCxxQkFBNEIsRUFBTSxFQUFFLElBQXFCO0lBQ3hELElBQUksTUFBTSxHQUFHLGNBQWMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFFckMsSUFBSSxNQUFNLEVBQUU7UUFDWCxNQUFNLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQTtR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