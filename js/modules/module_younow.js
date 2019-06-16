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
    return module_www_1.getURL(`${API}/php/api/younow/queue/locale=en/numberOfRecords=50/startFrom=0/tag=${encodeURIComponent(tag)}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3lvdW5vdy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZHVsZXMvbW9kdWxlX3lvdW5vdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0EsOEJBQTZCO0FBRzdCLHNDQUFxQztBQUVyQyw2Q0FBZ0U7QUFDaEUsMkNBQW9DO0FBQ3BDLDBDQUF5QztBQUN6QyxvRUFBK0Q7QUFDL0QsOENBQWlDO0FBQ2pDLGlEQUFxRjtBQUNyRiw2Q0FBcUM7QUFVckMsTUFBTSxHQUFHLEdBQUcsd0JBQXdCLENBQUE7QUFDcEMsTUFBTSxHQUFHLEdBQUcsd0JBQXdCLENBQUE7QUFFcEMsU0FBZ0IsV0FBVyxDQUFDLElBQUk7SUFLL0IsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDaEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUMvQixPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFBO0tBQ2pEO1NBQ0k7UUFDSixPQUFPLElBQUksQ0FBQTtLQUNYO0FBQ0YsQ0FBQztBQVpELGtDQVlDO0FBRUQsU0FBZ0IsYUFBYSxDQUFDLE1BQWdEO0lBRTdFLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQSxDQUFDLENBQUEsR0FBRyxNQUFNLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQSxDQUFDLENBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQTtBQUNsRixDQUFDO0FBSEQsc0NBR0M7QUFlRCxTQUFnQixXQUFXLENBQUMsRUFBTSxFQUFFLElBQXFCO0lBQ3hELElBQUksTUFBTSxHQUFHLGNBQWMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFFckMsSUFBSSxNQUFNLEVBQUU7UUFDWCxNQUFN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