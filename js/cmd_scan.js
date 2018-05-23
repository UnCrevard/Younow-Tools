"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("./main");
const fs = require("fs");
const _path = require("path");
const vm = require("vm");
const module_log_1 = require("./modules/module_log");
const _younow = require("./module_younow");
const module_db_1 = require("./modules/module_db");
let liveusers = {};
let script = null;
function cmdScan(script_file) {
    new module_db_1.FakeDB()
        .open(_path.join(main_1.settings.pathConfig, "streams.txt"), "streams")
        .then(streams => {
        return _younow.openDB()
            .then((db) => {
            script = parseScript(script_file);
            setInterval(() => {
                update_scan(db, streams);
            }, main_1.settings.timeout * 60000);
            update_scan(db, streams);
            fs.watchFile(main_1.settings.pathDB, (curr, prev) => {
                module_log_1.info(`DATABASE UPDATED`);
                db.self.update();
            });
        });
    })
        .catch(module_log_1.error);
}
exports.cmdScan = cmdScan;
function update_scan(db, streams) {
    _younow.getTrendings()
        .then(function (trendings) {
        let tags = trendings.trending_tags.filter(function (tag) {
            return runScript(tag, null, null) || false;
        }).map(tag => tag.tag);
        var new_users = 0;
        var new_resolve = 0;
        tags.forEach(function (tag) {
            _younow.getTagInfo(tag)
                .then(function (infos) {
                if (infos.errorCode) {
                    throw new Error(`${tag} ${infos.errorCode} ${infos.errorMsg}`);
                }
                else if (!infos.items) {
                    return;
                }
                module_log_1.info(`Tag:${tag} Users:${infos.items.length}`);
                infos.items.forEach(function (user) {
                    function showInfos(result, user, liveuser) {
                        module_log_1.info(`1ST Result ${result} ${liveuser.check}:${liveuser.infos ? "*" : ""} ${user.profile} BC:${liveuser.infos && liveuser.infos.broadcastsCount} LVL:${user.userlevel} VW:${user.viewers}/${user.views} Language:${user.l}`);
                    }
                    var liveuser = liveusers[user.userId];
                    if (!liveuser) {
                        new_users++;
                        liveuser = liveusers[user.userId] =
                            {
                                userId: user.userId,
                                broadcastId: null,
                                isIgnored: false,
                                isFollowed: false,
                                infos: null,
                                check: 0
                            };
                    }
                    if (user.userId in streams) {
                        if (streams[user.userId].indexOf(user.broadcastId) < 0) {
                            let items = streams[user.userId];
                            items.push(user.broadcastId);
                            streams[user.userId] = items;
                        }
                    }
                    else {
                        streams[user.userId] = [user.broadcastId];
                    }
                    let dbuser = db[user.userId];
                    if (dbuser) {
                        if (dbuser.ignore) {
                            if (liveuser.isIgnored == false) {
                                module_log_1.log(`${user.profile} is now ignored`);
                            }
                            liveuser.isFollowed = false;
                            liveuser.isIgnored = true;
                            return;
                        }
                        else if (liveuser.isFollowed == false) {
                            module_log_1.log(`${user.profile} is live note:${dbuser.comment}`);
                            liveuser.isFollowed = true;
                            liveuser.isIgnored = false;
                        }
                    }
                    if (liveuser.isFollowed) {
                        if (liveuser.broadcastId == user.broadcastId) {
                            return;
                        }
                        module_log_1.log(`NEW ${user.profile} ${user.broadcastId}`);
                    }
                    else if (liveuser.isIgnored) {
                        return;
                    }
                    else {
                        liveuser.check++;
                        let result = runScript(null, user, liveuser.infos);
                        showInfos(result, user, liveuser);
                        if (result == "follow") {
                            liveuser.isFollowed = true;
                        }
                        else if (result == "ignore") {
                            liveuser.isIgnored = true;
                            return;
                        }
                        else if (result != "resolve") {
                            return;
                        }
                    }
                    Promise.resolve(liveuser.infos)
                        .then(function (infos) {
                        if (infos) {
                            if (infos.broadcastId != user.broadcastId) {
                                new_resolve++;
                                module_log_1.info(`update infos for ${user.profile}`);
                                return _younow.getLiveBroadcastByUID(user.userId);
                            }
                            else {
                                return infos;
                            }
                        }
                        else {
                            new_resolve++;
                            return _younow.getLiveBroadcastByUID(user.userId);
                        }
                    })
                        .then(function (infos) {
                        if (infos.errorCode == 206) {
                            module_log_1.info(`${user.profile} ${infos.errorCode} ${infos.errorMsg}`);
                            return;
                        }
                        else if (infos.errorCode) {
                            throw new Error(`${infos.errorCode} ${infos.errorMsg}`);
                        }
                        liveuser.infos = infos;
                        if (liveuser.isFollowed == false) {
                            liveuser.check++;
                            let result = runScript(null, user, infos) || null;
                            showInfos(result, user, liveuser);
                            if (result == "follow") {
                                liveuser.isFollowed = true;
                            }
                            else if (result == "ignore") {
                                liveuser.isIgnored = true;
                                return;
                            }
                            else {
                                return;
                            }
                        }
                        if (liveuser.isFollowed) {
                            if (infos.lastSegmentId == undefined) {
                                module_log_1.error(`${infos.profile} not ready yet`);
                                liveuser.infos = null;
                                return;
                            }
                            module_log_1.log(`MATCH ${user.profile} Viewers:${infos.viewers}/${user.viewers} ${infos.country} state:${infos.stateCopy + " " + infos.state} BC:${infos.broadcastsCount} Partner:${infos.partner} Platform:${infos.platform}`);
                            liveuser.infos = infos;
                            liveuser.broadcastId = user.broadcastId;
                            _younow.downloadThemAll(infos)
                                .then(([thumb, video, json]) => {
                                module_log_1.log(`${user.profile} is over json : ${thumb} image : ${video} video :${json}`);
                            }, err => {
                                module_log_1.error(err);
                            });
                        }
                    })
                        .catch(module_log_1.error);
                });
            })
                .catch(module_log_1.error)
                .then(function () {
                if (new_resolve)
                    module_log_1.info(`result new users:${new_users} resolve:${new_resolve}`);
            });
        });
    })
        .catch((err) => {
        module_log_1.error(err);
    });
}
function parseScript(filename) {
    var code = fs.readFileSync(filename).toString();
    return new vm.Script(code);
}
function runScript(tag, user, broadcast) {
    try {
        var context = new vm.createContext({
            "tag": tag,
            "user": user,
            "broadcast": broadcast,
            "log": module_log_1.log
        });
        return script.runInContext(context);
    }
    catch (e) {
        module_log_1.error(e);
        return null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kX3NjYW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9jbWRfc2Nhbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUFpQztBQUNqQyx5QkFBd0I7QUFDeEIsOEJBQTZCO0FBQzdCLHlCQUF3QjtBQUV4QixxREFBb0U7QUFDcEUsMkNBQTBDO0FBQzFDLG1EQUE0QztBQUk1QyxJQUFJLFNBQVMsR0FBYSxFQUFFLENBQUE7QUFDNUIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFBO0FBRWpCLGlCQUF3QixXQUFtQjtJQUMxQyxJQUFJLGtCQUFNLEVBQUU7U0FDVixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFRLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxFQUFFLFNBQVMsQ0FBQztTQUMvRCxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDZixPQUFPLE9BQU8sQ0FBQyxNQUFNLEVBQUU7YUFDckIsSUFBSSxDQUFDLENBQUMsRUFBTSxFQUFFLEVBQUU7WUFDaEIsTUFBTSxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtZQUVqQyxXQUFXLENBQUMsR0FBRyxFQUFFO2dCQUNoQixXQUFXLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1lBQ3pCLENBQUMsRUFBRSxlQUFRLENBQUMsT0FBTyxRQUFvQixDQUFDLENBQUE7WUFFeEMsV0FBVyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQTtZQUV4QixFQUFFLENBQUMsU0FBUyxDQUFDLGVBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUU7Z0JBQzVDLGlCQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtnQkFDeEIsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTtZQUNqQixDQUFDLENBQUMsQ0FBQTtRQUNILENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDO1NBQ0QsS0FBSyxDQUFDLGtCQUFL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