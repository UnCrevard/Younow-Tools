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
                else if (!infos.queues && !infos.queues[0].items) {
                    module_log_1.debug(module_log_1.prettify(infos));
                    module_log_1.debug("TagInfo.items is empty");
                    return;
                }
                module_log_1.info(`Tag:${tag} Users:${infos.queues[0].items.length}`);
                infos.queues[0].items.forEach(function (user) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kX3NjYW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9jbWRfc2Nhbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlCQUF3QjtBQUN4Qiw4QkFBNkI7QUFDN0IseUJBQXdCO0FBRXhCLHFEQUE2RTtBQUM3RSxtREFBa0Q7QUFDbEQsbURBQTRDO0FBUzVDLElBQUksU0FBUyxHQUFhLEVBQUUsQ0FBQTtBQUM1QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUE7QUFFakIsU0FBZ0IsT0FBTyxDQUFDLFdBQW1CO0lBQzFDLElBQUksa0JBQU0sRUFBRTtTQUNWLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxFQUFFLFNBQVMsQ0FBQztTQUN0RSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDZixPQUFPLE9BQU8sQ0FBQyxNQUFNLEVBQUU7YUFDckIsSUFBSSxDQUFDLENBQUMsRUFBTSxFQUFFLEVBQUU7WUFDaEIsTUFBTSxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtZQUVqQyxXQUFXLENBQUMsR0FBRyxFQUFFO2dCQUNoQixXQUFXLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1lBQ3pCLENBQUMsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sUUFBb0IsQ0FBQyxDQUFBO1lBRS9DLFdBQVcsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUE7WUFFeEIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRTtnQkFDbkQsaUJBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO2dCQUN4QixFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO1lBQ2pCLENBQUMsQ0FBQyxDQUFBO1FBQ0gsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFD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