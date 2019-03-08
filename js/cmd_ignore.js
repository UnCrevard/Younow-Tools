"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_log_1 = require("./modules/module_log");
const younow = require("./modules/module_younow");
const _async = require("async");
function cmdIgnore(users) {
    younow.openDB()
        .then(db => {
        _async.eachSeries(users, function (user, callback) {
            user = younow.extractUser(user);
            let userdb = younow.isUsernameInDB(db, user);
            if (userdb) {
                userdb.ignore = !userdb.ignore;
                db[userdb.userId] = userdb;
                module_log_1.log(`${userdb.profile} in the db has been ${userdb.ignore ? "ignored" : "unignored"}`);
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
                        let userdb = younow.convertToUserDB(infos.userId, infos);
                        userdb.ignore = true;
                        db[infos.userId] = userdb;
                        module_log_1.log(`${infos.profile} has been ignored and added to the db`);
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
exports.cmdIgnore = cmdIgnore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kX2lnbm9yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2NtZF9pZ25vcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBaUQ7QUFDakQsa0RBQWlEO0FBQ2pELGdDQUErQjtBQUUvQixtQkFBMEIsS0FBZTtJQUN4QyxNQUFNLENBQUMsTUFBTSxFQUFFO1NBQ2IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQ1YsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsVUFBUyxJQUFJLEVBQUUsUUFBUTtZQUMvQyxJQUFJLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUUvQixJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQTtZQUU1QyxJQUFJLE1BQU0sRUFBRTtnQkFDWCxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQTtnQkFDOUIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUE7Z0JBQzFCLGdCQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsT0FBTyx1QkFBdUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFBO2dCQUN0RixRQUFRLEVBQUUsQ0FBQTthQUNWO2lCQUNJO2dCQUNKLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQztxQkFDMUIsSUFBSSxDQUFDLFVBQVMsS0FBc0I7b0JBQ3BDLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRTt3QkFDcEIsa0JBQUssQ0FBQyxHQUFHLElBQUksSUFBSSxLQUFLLENBQUMsU0FBUyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO3dCQUNyRCxRQUFRLEVBQUUsQ0FBQTtxQkFDVjt5QkFDSTt3QkFDSixJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUE7d0JBQ3hELE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFBO3dCQUVwQixFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQTt3QkFFekIsZ0JBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxPQUFPLHVDQUF1QyxDQUFDLENBQUE7d0JBQzVELFFBQVEsRUFBRSxDQUFBO3FCQUNWO2dCQUNGLENBQUMsQ0FBQztxQkFDRCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ1osa0JBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtvQkFDVixRQUFRLEVBQUUsQ0FBQTtnQkFDWCxDQUFDLENBQUMsQ0FBQTthQUNIO1FBQ0YsQ0FBQyxDQUFDLENBQUE7SUFDSCxDQUFDLENBQUM7U0FDRCxLQUFLLENBQUMsa0JBQUssQ0FBQyxDQUFBO0FBQ2YsQ0FBQztBQXZDRCw4QkF1Q0MifQ==