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
                                                module_log_1.info(moment.broadcaster.name, moment.broadcastId, module_utils_1.formatDateTime(new Date(moment.created * 1000)));
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
                                            callback_moments(null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kX3Zjci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2NtZF92Y3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLG1EQUFrRDtBQUNsRCxzREFBcUQ7QUFDckQsd0RBQXVEO0FBRXZELGdDQUErQjtBQUMvQixxREFBd0U7QUFDeEUsbURBQTRDO0FBRzVDLG9EQUFtRDtBQUNuRCw2QkFBNEI7QUFDNUIseURBQTRFO0FBQzVFLHFEQUE0RDtBQUU1RCxTQUFzQixNQUFNLENBQUMsUUFBa0IsRUFBRSxLQUFlOztRQUUvRCxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7WUFDcEIsT0FBTyxDQUFDLE1BQU0sRUFBRTtpQkFDZCxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQ1YsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsVUFBUyxJQUFJLEVBQUUsY0FBYztvQkFDckQsSUFBSSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUE7b0JBRWhDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQzt5QkFDM0IsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7d0JBQ2xCLElBQUksUUFBUSxDQUFDLFNBQVMsSUFBSSxDQUFDLEVBQUU7NEJBQzVCLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUE7NEJBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTs0QkFDVCxJQUFJLG1CQUFtQixHQUF5QixFQUFFLENBQUE7NEJBRWxELE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBUyxJQUFJO2dDQUMzQixPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7cUNBQ3hCLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO29DQUNqQixJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksQ0FBQyxFQUFFO3dDQUUzQixLQUFLLElBQUksTUFBTSxJQUFJLE9B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