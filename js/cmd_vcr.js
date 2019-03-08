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
const _younow = require("./modules/module_younow");
const snapchat = require("./modules/module_snapchat");
const periscope = require("./modules/module_periscope");
const _async = require("async");
const module_log_1 = require("./modules/module_log");
const module_db_1 = require("./modules/module_db");
const dos = require("./modules/module_promixified");
const path = require("path");
const module_utils_1 = require("./modules/module_utils");
const module_www_1 = require("./modules/module_www");
function cmdVCR(settings, users) {
    return __awaiter(this, void 0, void 0, function* () {
        if (settings.younow) {
            _younow.openDB()
                .then(db => {
                _async.eachSeries(users, function (user, callback_users) {
                    user = _younow.extractUser(user);
                    _younow.resolveUser(db, user)
                        .then((userinfo) => {
                        if (userinfo.errorCode == 0) {
                            let uid = userinfo.userId;
                            let n = 0;
                            let downloadableMoments = [];
                            _async.forever(function (next) {
                                _younow.getMoments(uid, n)
                                    .then((moments) => {
                                    if (moments.errorCode == 0) {
                                        for (let moment of moments.items) {
                                            if (moment.broadcaster.userId) {
                                                downloadableMoments.push(moment);
                                            }
                                        }
                                        module_log_1.log(`current broadcast extracted ${downloadableMoments.length}`);
                                        if (moments.hasMore && moments.items.length) {
                                            n = moments.items[moments.items.length - 1].created;
                                            next(false);
                                        }
                                        else {
                                            next(true);
                                        }
                                    }
                                    else {
                                        throw new Error(`${userinfo.profile} ${userinfo.errorCode} ${userinfo.errorMsg}`);
                                    }
                                })
                                    .catch(err => {
                                    module_log_1.error(err);
                                    next(false);
                                });
                            }, function (err) {
                                if (downloadableMoments.length == 0) {
                                    callback_users();
                                }
                                else {
                                    _async.eachSeries(downloadableMoments.reverse(), function (moment, callback_moments) {
                                        _younow.downloadArchive(userinfo, moment.broadcastId, moment.created)
                                            .then(result => {
                                            callback_moments();
                                        }, err => {
                                            module_log_1.error(err);
                                            return false;
                                        });
                                    }, callback_users);
                                }
                            });
                        }
                        else {
                            module_log_1.error(`${user} ${userinfo.errorCode} ${userinfo.errorMsg}`);
                        }
                    })
                        .catch((err) => {
                        module_log_1.error(err);
                        callback_users();
                    });
                });
            })
                .catch(module_log_1.error);
        }
        else if (settings.snapchat) {
            let db = yield new module_db_1.FakeDB().open(path.join(settings.pathConfig, "snapchat_stories.db"), "Snapchat stories");
            users.forEach((user) => __awaiter(this, void 0, void 0, function* () {
                yield snapchat.getStories(user)
                    .then((stories) => __awaiter(this, void 0, void 0, function* () {
                    if (!stories.story.snaps) {
                        stories.story.snaps = [];
                    }
                    module_log_1.log("download from", stories.story.metadata.title, stories.story.snaps.length, "Stories");
                    if (settings.json) {
                        dos.writeFile(path.join(settings.pathDownload, user + ".json"), module_log_1.prettify(stories)).catch(module_log_1.error);
                    }
                    stories.story.snaps.forEach((snap) => __awaiter(this, void 0, void 0, function* () {
                        if (snap.id in db) {
                        }
                        else {
                            module_log_1.log("download", snap.title, snap.media.type);
                            let basename = path.join(settings.pathDownload, `${module_utils_1.cleanFilename(stories.story.metadata.title)}_${module_utils_1.formatDateTime(new Date(snap.captureTimeSecs * module_utils_1.Time.MILLI))}`);
                            let filenameVideo = basename + ".mp4";
                            let filenameImage = basename + ".jpg";
                            switch (snap.media.type) {
                                case "VIDEO":
                                case "VIDEO_NO_SOUND":
                                    if (!(yield dos.exists(filenameVideo))) {
                                        yield module_www_1.download(snap.media.mediaUrl, filenameVideo);
                                    }
                                    break;
                                case "IMAGE":
                                    if (!(yield dos.exists(filenameImage))) {
                                        yield module_www_1.download(snap.media.mediaUrl, filenameImage);
                                    }
                                    break;
                                default:
                                    module_log_1.error("snap.media.type", snap.media.type);
                            }
                            db[snap.id] = snap;
                        }
                    }));
                }))
                    .catch(module_log_1.error);
            }));
        }
        else if (settings.periscope) {
            const db = yield new module_db_1.FakeDB().open(path.join(settings.pathConfig, "periscope.json"), "Periscope lives");
            users.forEach((user) => __awaiter(this, void 0, void 0, function* () {
                let url = periscope.parseURL(user);
                if (url) {
                    yield module_www_1.getURL(url, "utf8")
                        .then(body => {
                        try {
                            if (body) {
                                var match = body.toString().match(/data\-store\=\"(.+?)\"/i);
                                if (match) {
                                    var result = match[1];
                                    result = result.replace(/&quot;/gi, `"`);
                                    result = result.replace(/&amp;/gi, `&`);
                                    let dataStore = JSON.parse(result);
                                    try {
                                        let tokens = dataStore.SessionToken;
                                        let users = dataStore.UserCache.users;
                                        let broadcasts = dataStore.BroadcastCache.broadcasts;
                                        if (!tokens || !users) {
                                            throw "SessionToken or user is missing";
                                        }
                                        var user = users[Object.keys(users)[0]].user;
                                        return module_www_1.getURL(`${periscope.API}getUserBroadcastsPublic?user_id=${user.id}&all=true&session_id=${tokens.public.broadcastHistory.token.session_id}`)
                                            .then(json => {
                                            if (json) {
                                                let broadcasts = json.broadcasts;
                                                _async.eachSeries(broadcasts, function (broadcast, cbAsync) {
                                                    try {
                                                        if (broadcast.id == null) {
                                                            throw new Error("broadcast.id==null");
                                                        }
                                                        else if (broadcast.id in db) {
                                                            module_log_1.log(`${broadcast.id} already downloaded`);
                                                            cbAsync();
                                                        }
                                                        else {
                                                            module_log_1.log(`State:${broadcast.state} Twitter:${broadcast.twitter_username || "?"} username:${broadcast.username} nick:${broadcast.user_display_name} lang:${broadcast.language} country:${broadcast.country} city:${broadcast.city} status:${broadcast.status}`);
                                                            if (broadcast.state == "ENDED" && broadcast.available_for_replay) {
                                                                periscope.getBroadcast(broadcast.id)
                                                                    .then(video => {
                                                                    if (video.broadcast.available_for_replay) {
                                                                        let basename = periscope.createFilename(video.broadcast);
                                                                        if (settings.thumbnail) {
                                                                            periscope.downloadThumbnail(basename + ".jpg", video.broadcast).catch(module_log_1.error);
                                                                        }
                                                                        if (settings.json) {
                                                                            dos.writeFile(basename + ".json", JSON.stringify(video, null, "\t")).catch(module_log_1.error);
                                                                        }
                                                                        return periscope.downloadVideo(basename + "." + settings.videoFormat, video)
                                                                            .then(bool => {
                                                                            db[video.broadcast.id] = video.broadcast;
                                                                        })
                                                                            .catch(err => {
                                                                            module_log_1.log(`the problem is ${err}`);
                                                                        })
                                                                            .then(bool => {
                                                                            module_log_1.log(`${video.broadcast.status} downloaded`);
                                                                            cbAsync();
                                                                        });
                                                                    }
                                                                    else {
                                                                        cbAsync();
                                                                    }
                                                                })
                                                                    .catch(err => {
                                                                    module_log_1.error(err);
                                                                    cbAsync();
                                                                });
                                                            }
                                                            else {
                                                                cbAsync();
                                                            }
                                                        }
                                                    }
                                                    catch (e) {
                                                        module_log_1.error(e);
                                                        cbAsync();
                                                    }
                                                }, function () {
                                                });
                                            }
                                        });
                                    }
                                    catch (e) {
                                        module_log_1.log(dataStore);
                                        module_log_1.error(e);
                                    }
                                }
                                else {
                                    module_log_1.error("fail to parse data-store");
                                }
                            }
                        }
                        catch (e) {
                            module_log_1.error(e);
                        }
                    })
                        .catch(module_log_1.error);
                }
            }));
        }
        else {
            module_log_1.error("not implemented");
        }
    });
}
exports.cmdVCR = cmdVCR;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kX3Zjci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2NtZF92Y3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLG1EQUFrRDtBQUNsRCxzREFBcUQ7QUFDckQsd0RBQXVEO0FBRXZELGdDQUErQjtBQUMvQixxREFBd0U7QUFDeEUsbURBQTRDO0FBRzVDLG9EQUFtRDtBQUNuRCw2QkFBNEI7QUFDNUIseURBQTRFO0FBQzVFLHFEQUE0RDtBQUU1RCxnQkFBNkIsUUFBa0IsRUFBRSxLQUFlOztRQUUvRCxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7WUFDcEIsT0FBTyxDQUFDLE1BQU0sRUFBRTtpQkFDZCxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQ1YsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsVUFBUyxJQUFJLEVBQUUsY0FBYztvQkFDckQsSUFBSSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUE7b0JBRWhDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQzt5QkFDM0IsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7d0JBQ2xCLElBQUksUUFBUSxDQUFDLFNBQVMsSUFBSSxDQUFDLEVBQUU7NEJBQzVCLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUE7NEJBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTs0QkFDVCxJQUFJLG1CQUFtQixHQUF5QixFQUFFLENBQUE7NEJBRWxELE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBUyxJQUFJO2dDQUMzQixPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7cUNBQ3hCLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO29DQUNqQixJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksQ0FBQyxFQUFFO3dDQUUzQixLQUFLLElBQUksTUFBTSxJQUFJLE9BQU8sQ0FBQyxL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