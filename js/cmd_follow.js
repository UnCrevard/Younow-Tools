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
const younow = require("./modules/module_younow");
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
                                                        module_log_1.log(`${live.profile} is broadcasting ${live.broadcastId} ${younow.errortoString(live)}`);
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
            setInterval(monitor, global.settings.timeout * 60000);
            monitor();
        })
            .catch(module_log_1.error);
    });
}
exports.cmdFollow = cmdFollow;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kX2ZvbGxvdy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2NtZF9mb2xsb3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLGtEQUFpRDtBQUNqRCxxREFBaUU7QUFVakUsU0FBc0IsU0FBUyxDQUFDLEtBQWU7O1FBQzlDLElBQUksRUFBRSxHQUFPLE1BQU0sTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFBO1FBRWxDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM1QixPQUFPLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3JELElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDZCxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUU7b0JBQ3JCLE1BQU0sR0FBRyxJQUFJLElBQUksTUFBTSxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUE7aUJBQ3REO2dCQUVELE9BQU8sTUFBTSxDQUFBO1lBQ2QsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQzthQUNELElBQUksQ0FBQyxDQUFDLFFBQXVCLEVBQUUsRUFBRTtZQUNqQyxJQUFJLGdCQUFnQixHQUFxQixFQUFFLENBQUE7WUFFM0MsU0FBZSxPQUFPOztvQkFDckIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFO3dCQUNsQyxPQUFPLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7b0JBQ2hELENBQUMsQ0FBQyxDQUFDO3lCQUNELElBQUksQ0FBQyxDQUFDLGdCQUF5QyxFQUFFLEVBQUU7d0JBQ25ELElBQUksR0FBRyxHQUFHLGdCQUFnQixDQUFBO3dCQUUxQixnQkFBZ0IsR0FBRyxFQUFFLENBQUE7d0JBRXJCLEtB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