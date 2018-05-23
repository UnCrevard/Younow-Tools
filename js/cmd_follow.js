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
const module_www_1 = require("./modules/module_www");
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
                        return module_www_1.getURL(`https://api.younow.com/php/api/channel/getLocationOnlineFansOf/channelId=${curator.userId}/numberOfRecords=50`)
                            .catch(err => {
                            module_log_1.error(err);
                            return null;
                        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kX2ZvbGxvdy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2NtZF9mb2xsb3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDBDQUF5QztBQUN6QyxpQ0FBaUM7QUFDakMscURBQWlFO0FBQ2pFLHFEQUE2QztBQVM3QyxtQkFBZ0MsS0FBZTs7UUFDOUMsSUFBSSxFQUFFLEdBQU8sTUFBTSxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUE7UUFFbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzVCLE9BQU8sTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDckQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUNkLElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRTtvQkFDckIsTUFBTSxHQUFHLElBQUksSUFBSSxNQUFNLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQTtpQkFDdEQ7Z0JBRUQsT0FBTyxNQUFNLENBQUE7WUFDZCxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFDO2FBQ0QsSUFBSSxDQUFDLENBQUMsUUFBdUIsRUFBRSxFQUFFO1lBQ2pDLElBQUksZ0JBQWdCLEdBQXFCLEVBQUUsQ0FBQTtZQUUzQzs7b0JBQ0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFO3dCQUNsQyxPQUFPLG1CQUFNLENBQUMsNEVBQTRFLE9BQU8sQ0FBQyxNQUFNLHFCQUFxQixDQUFDOzZCQUM1SCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7NEJBQ1osa0JBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTs0QkFDVixPQUFPLElBQUksQ0FBQTt3QkFDWixDQUFDLENBQUMsQ0FBQTtvQkFDSixDQUFDLENBQUMsQ0FBQzt5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