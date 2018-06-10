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
const younow = require("./module_younow");
const main_1 = require("./main");
const module_log_1 = require("./modules/module_log");
function cmdFollow(users) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield younow.openDB();
        Promise.all(users.map(user => {
            return younow.resolveUser(db, younow.extractUser(user))
                .then(dbuser => {
                if (dbuser.errorCode) {
                    throw `${user} ${dbuser.errorCode} ${dbuser.errorMsg}`;
                }
                return dbuser;
            });
        }))
            .then((curators) => {
            let liveBroadcasters = {};
            function monitor() {
                return __awaiter(this, void 0, void 0, function* () {
                    Promise.all(curators.map(curator => {
                        return younow.getOnlineFollowed(curator.userId);
                    }))
                        .then((curatorsFollowed) => {
                        let old = liveBroadcasters;
                        liveBroadcasters = {};
                        for (let curatorFollowed of curatorsFollowed) {
                            if (curatorFollowed) {
                                for (let followed of curatorFollowed.users) {
                                    let userId = followed.userId;
                                    if (userId in old) {
                                        liveBroadcasters[userId] = old[userId];
                                    }
                                    else {
                                        liveBroadcasters[userId] = { status: null };
                                    }
                                    let broadcaster = liveBroadcasters[userId];
                                    if (userId in db && db[userId].ignore) {
                                        if (broadcaster.status == null) {
                                            module_log_1.info(`${followed.profile} is ignored`);
                                        }
                                        broadcaster.status = followed.status;
                                    }
                                    else {
                                        if (followed.status != broadcaster.status) {
                                            broadcaster.status = followed.status;
                                            switch (followed.status) {
                                                case 0:
                                                    module_log_1.log(`${followed.profile} is watching ${followed.channelName}`);
                                                    break;
                                                case 2:
                                                    younow.getLiveBroadcastByUID(userId)
                                                        .then(live => {
                                                        if (live.errorCode || live.lastSegmentId == undefined) {
                                                            broadcaster.status = null;
                                                            module_log_1.info(`${live.profile} is not ready`);
                                                        }
                                                        else {
                                                            return younow.downloadThemAll(live)
                                                                .then(([thumb, video, json]) => {
                                                                module_log_1.log(`${followed.profile} is over json : ${thumb} image : ${video} video :${json}`);
                                                            });
                                                        }
                                                    })
                                                        .catch(module_log_1.error);
                                                    break;
                                                default:
                                                    module_log_1.error(`Status:${followed.status}`);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    })
                        .catch(module_log_1.error);
                });
            }
            setInterval(monitor, main_1.settings.timeout * 60000);
            monitor();
        })
            .catch(module_log_1.error);
    });
}
exports.cmdFollow = cmdFollow;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kX2ZvbGxvdy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2NtZF9mb2xsb3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDBDQUF5QztBQUN6QyxpQ0FBaUM7QUFDakMscURBQWlFO0FBVWpFLG1CQUFnQyxLQUFlOztRQUM5QyxJQUFJLEVBQUUsR0FBTyxNQUFNLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtRQUVsQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDNUIsT0FBTyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNyRCxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ2QsSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO29CQUNyQixNQUFNLEdBQUcsSUFBSSxJQUFJLE1BQU0sQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFBO2lCQUN0RDtnQkFFRCxPQUFPLE1BQU0sQ0FBQTtZQUNkLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsQ0FBQyxRQUF1QixFQUFFLEVBQUU7WUFDakMsSUFBSSxnQkFBZ0IsR0FBcUIsRUFBRSxDQUFBO1lBRTNDOztvQkFDQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7d0JBQ2xDLE9BQU8sTUFBTSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtvQkFDaEQsQ0FBQyxDQUFDLENBQUM7eUJBQ0QsSUFBSSxDQUFDLENBQUMsZ0JBQXlDLEVBQUUsRUFBRTt3QkFDbkQsSUFBSSxHQUFHLEdBQUcsZ0JBQWdCLENBQUE7d0JBRTFCLGdCQUFnQixHQUFHLEVBQUUsQ0FBQTt3QkFFckIsS0FBSyxJQUFJ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