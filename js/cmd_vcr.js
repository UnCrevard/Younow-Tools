"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _younow = require("./module_younow");
const _async = require("async");
const module_log_1 = require("./modules/module_log");
function cmdVCR(users) {
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
exports.cmdVCR = cmdVCR;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kX3Zjci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2NtZF92Y3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBMEM7QUFDMUMsZ0NBQStCO0FBQy9CLHFEQUF3RTtBQUV4RSxnQkFBdUIsS0FBZTtJQUNyQyxPQUFPLENBQUMsTUFBTSxFQUFFO1NBQ2QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQ1YsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsVUFBUyxJQUFJLEVBQUUsY0FBYztZQUNyRCxJQUFJLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUVoQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUM7aUJBQzNCLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO2dCQUNsQixJQUFJLFFBQVEsQ0FBQyxTQUFTLElBQUksQ0FBQyxFQUFFO29CQUM1QixJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFBO29CQUN6QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7b0JBQ1QsSUFBSSxtQkFBbUIsR0FBeUIsRUFBRSxDQUFBO29CQUVsRCxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVMsSUFBSTt3QkFDM0IsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDOzZCQUN4QixJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTs0QkFDakIsSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLENBQUMsRUFBRTtnQ0FDM0IsS0FBSyxJQUFJLE1BQU0sSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFO29DQUNqQyxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFBRTt3Q0FDckMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO3FDQUNoQztpQ0FDRDtnQ0FFRCxnQkFBRyxDQUFDLCtCQUErQixtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBO2dDQUVoRSxJQUFJLE9BQU8sQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQzNDO29DQUNDLENBQUMsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQTtvQ0FDbkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO2lDQUNYO3FDQUNJO29DQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtpQ0FDVjs2QkFDRDtpQ0FDSTtnQ0FDSixNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsUUFBUSxDQUFDLE9BQU8sSUFBSSxRQUFRLENBQUMsU0FBUyxJQUFJLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBOzZCQUNqRjt3QkFDRixDQUFDLENBQUM7NkJBQ0QsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFOzRCQUNaLGtCQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7NEJBQ1YsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO3dCQUNaLENBQUMsQ0FBQyxDQUFBO29CQUNKLENBQUMsRUFBRSxVQUFTLEdBQUc7d0JBQ2IsSUFBSSxtQkFBbUIsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFOzRCQUNwQyxjQUFjLEVBQUUsQ0FBQTt5QkFDaEI7NkJBQ0k7NEJBQ0osTUFBTSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsRUFBRSxVQUFTLE1BQU0sRUFBRSxnQkFBZ0I7Z0NBQ2pGLE9BQU8sQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQztxQ0FDbkUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO29DQUNkLGdCQUFnQixFQUFFLENBQUE7Z0NBQ25CLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRTtvQ0FDUCxrQkFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO29DQUNWLE9BQU8sS0FBSyxDQUFBO2dDQUNiLENBQUMsQ0FBQyxDQUFBOzRCQUdMLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQTt5QkFDbEI7b0JBQ0YsQ0FBQyxDQUFDLENBQUE7aUJBQ0g7cUJBQ0k7b0JBQ0osa0JBQUssQ0FBQyxHQUFHLElBQUksSUFBSSxRQUFRLENBQUMsU0FBUyxJQUFJLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO2lCQUMzRDtZQUNGLENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDZCxrQkFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUNWLGNBQWMsRUFBRSxDQUFBO1lBQ2pCLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSCxDQUFDLENBQUM7U0FDRCxLQUFLLENBQUMsa0JBQUssQ0FBQyxDQUFBO0FBQ2YsQ0FBQztBQXhFRCx3QkF3RUMifQ==