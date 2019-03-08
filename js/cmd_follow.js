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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kX2ZvbGxvdy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2NtZF9mb2xsb3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLGtEQUFpRDtBQUNqRCxxREFBaUU7QUFVakUsbUJBQWdDLEtBQWU7O1FBQzlDLElBQUksRUFBRSxHQUFPLE1BQU0sTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFBO1FBRWxDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM1QixPQUFPLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3JELElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDZCxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUU7b0JBQ3JCLE1BQU0sR0FBRyxJQUFJLElBQUksTUFBTSxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUE7aUJBQ3REO2dCQUVELE9BQU8sTUFBTSxDQUFBO1lBQ2QsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQzthQUNELElBQUksQ0FBQyxDQUFDLFFBQXVCLEVBQUUsRUFBRTtZQUNqQyxJQUFJLGdCQUFnQixHQUFxQixFQUFFLENBQUE7WUFFM0M7O29CQUNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRTt3QkFDbEMsT0FBTyxNQUFNLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO29CQUNoRCxDQUFDLENBQUMsQ0FBQzt5QkFDRCxJQUFJLENBQUMsQ0FBQyxnQkFBeUMsRUFBRSxFQUFFO3dCQUNuRCxJQUFJLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQTt3QkFFMUIsZ0JBQWdCLEdBQUcsRUFBRSxDQUFBO3dCQUVyQixLQUFLLElBQUksZUFBZSxJQUFJLGdC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