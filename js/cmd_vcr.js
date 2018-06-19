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
const _younow = require("./module_younow");
const snapchat = require("./module_snapchat");
const periscope = require("./module_periscope");
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
                                            if (moment.broadcaster.userId == uid) {
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
                                        let broadcasts = dataStore.BroadcastCache.Broadcasts;
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
                                                                        if (settings.thumbnail) {
                                                                            periscope.downloadThumbnail(video.broadcast).catch(module_log_1.error);
                                                                        }
                                                                        if (settings.json) {
                                                                            dos.writeFile(periscope.createFilename(video.broadcast) + "." + "json", JSON.stringify(video, null, "\t")).catch(module_log_1.error);
                                                                        }
                                                                        return periscope.downloadVideo(periscope.createFilename(video.broadcast) + "." + settings.videoFormat, video)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kX3Zjci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2NtZF92Y3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDJDQUEwQztBQUMxQyw4Q0FBNkM7QUFDN0MsZ0RBQStDO0FBRS9DLGdDQUErQjtBQUMvQixxREFBd0U7QUFDeEUsbURBQTRDO0FBRzVDLG9EQUFtRDtBQUNuRCw2QkFBNEI7QUFDNUIseURBQTRFO0FBQzVFLHFEQUE0RDtBQUU1RCxnQkFBNkIsUUFBa0IsRUFBRSxLQUFlOztRQUUvRCxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7WUFDcEIsT0FBTyxDQUFDLE1BQU0sRUFBRTtpQkFDZCxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQ1YsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsVUFBUyxJQUFJLEVBQUUsY0FBYztvQkFDckQsSUFBSSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUE7b0JBRWhDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQzt5QkFDM0IsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7d0JBQ2xCLElBQUksUUFBUSxDQUFDLFNBQVMsSUFBSSxDQUFDLEVBQUU7NEJBQzVCLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUE7NEJBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTs0QkFDVCxJQUFJLG1CQUFtQixHQUF5QixFQUFFLENBQUE7NEJBRWxELE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBUyxJQUFJO2dDQUMzQixPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7cUNBQ3hCLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO29DQUNqQixJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksQ0FBQyxFQUFFO3dDQUMzQixLQUFLLElBQUksTUFBTSxJQUFJLE9BQU8sQ0FBQyxL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