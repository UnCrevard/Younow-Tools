"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const _path = require("path");
const vm = require("vm");
const module_log_1 = require("./modules/module_log");
const _younow = require("./modules/module_younow");
const module_db_1 = require("./modules/module_db");
let liveusers = {};
let script = null;
function cmdScan(script_file) {
    new module_db_1.FakeDB()
        .open(_path.join(global.settings.pathConfig, "streams.txt"), "streams")
        .then(streams => {
        return _younow.openDB()
            .then((db) => {
            script = parseScript(script_file);
            setInterval(() => {
                update_scan(db, streams);
            }, global.settings.timeout * 60000);
            update_scan(db, streams);
            fs.watchFile(global.settings.pathDB, (curr, prev) => {
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
                    if (global.settings.production == false) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kX3NjYW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9jbWRfc2Nhbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlCQUF3QjtBQUN4Qiw4QkFBNkI7QUFDN0IseUJBQXdCO0FBRXhCLHFEQUFvRTtBQUNwRSxtREFBa0Q7QUFDbEQsbURBQTRDO0FBSTVDLElBQUksU0FBUyxHQUFhLEVBQUUsQ0FBQTtBQUM1QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUE7QUFFakIsaUJBQXdCLFdBQW1CO0lBQzFDLElBQUksa0JBQU0sRUFBRTtTQUNWLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxFQUFFLFNBQVMsQ0FBQztTQUN0RSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDZixPQUFPLE9BQU8sQ0FBQyxNQUFNLEVBQUU7YUFDckIsSUFBSSxDQUFDLENBQUMsRUFBTSxFQUFFLEVBQUU7WUFDaEIsTUFBTSxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtZQUVqQyxXQUFXLENBQUMsR0FBRyxFQUFFO2dCQUNoQixXQUFXLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1lBQ3pCLENBQUMsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sUUFBb0IsQ0FBQyxDQUFBO1lBRS9DLFdBQVcsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUE7WUFFeEIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRTtnQkFDbkQsaUJBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO2dCQUN4QixFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO1lBQ2pCLENBQUMsQ0FBQyxDQUFBO1FBQ0gsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUM7U0FD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