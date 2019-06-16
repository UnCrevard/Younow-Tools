"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_log_1 = require("./modules/module_log");
const module_younow_1 = require("./modules/module_younow");
const younow = require("./modules/module_younow");
const _async = require("async");
function cmdAdd(users) {
    module_younow_1.openDB()
        .then((db) => {
        _async.eachSeries(users, function (user, callback) {
            user = younow.extractUser(user);
            let userdb = module_younow_1.isUsernameInDB(db, user);
            if (userdb) {
                module_log_1.log(`${userdb.profile} is already in the db`);
                callback();
            }
            else {
                younow.resolveUser(db, user)
                    .then(function (infos) {
                    if (infos.errorCode) {
                        module_log_1.error(`${user} ${infos.errorCode} ${infos.errorMsg}`);
                        callback();
                    }
                    else {
                        db[infos.userId] = module_younow_1.convertToUserDB(infos.userId, infos);
                        module_log_1.log(`${infos.profile} added to the db`);
                        callback();
                    }
                })
                    .catch(err => {
                    module_log_1.error(err);
                    callback();
                });
            }
        });
    })
        .catch(module_log_1.error);
}
exports.cmdAdd = cmdAdd;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kX2FkZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2NtZF9hZGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBaUQ7QUFDakQsMkRBQWlGO0FBQ2pGLGtEQUFpRDtBQUNqRCxnQ0FBK0I7QUFFL0IsU0FBZ0IsTUFBTSxDQUFDLEtBQWU7SUFDckMsc0JBQU0sRUFBRTtTQUNOLElBQUksQ0FBQyxDQUFDLEVBQU0sRUFBRSxFQUFFO1FBQ2hCLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLFVBQVMsSUFBSSxFQUFFLFFBQVE7WUFDL0MsSUFBSSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUE7WUFFL0IsSUFBSSxNQUFNLEdBQUcsOEJBQWMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7WUFFckMsSUFBSSxNQUFNLEVBQUU7Z0JBQ1gsZ0JBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLHVCQUF1QixDQUFDLENBQUE7Z0JBQzdDLFFBQVEsRUFBRSxDQUFBO2FBQ1Y7aUJBQ0k7Z0JBQ0osTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDO3FCQUMxQixJQUFJLENBQUMsVUFBUyxLQUFzQjtvQkFDcEMsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFO3dCQUNwQixrQkFBSyxDQUFDLEdBQUcsSUFBSSxJQUFJLEtBQUssQ0FBQyxTQUFTLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7d0JBQ3JELFFBQVEsRUFBRSxDQUFBO3FCQUNWO3lCQUNJO3dCQUNKLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsK0JBQWUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFBO3dCQUV2RCxnQkFBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU8sa0JBQWtCLENBQUMsQ0FBQTt3QkFDdkMsUUFBUSxFQUFFLENBQUE7cUJBQ1Y7Z0JBQ0YsQ0FBQyxDQUFDO3FCQUNELEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDWixrQkFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO29CQUNWLFFBQVEsRUFBRSxDQUFBO2dCQUNYLENBQUMsQ0FBQyxDQUFBO2FBQ0g7UUFDRixDQUFDLENBQUMsQ0FBQTtJQUNILENBQUMsQ0FBQztTQUNELEtBQUssQ0FBQyxrQkFBSyxDQUFDLENBQUE7QUFDZixDQUFDO0FBbENELHdCQWtDQyJ9