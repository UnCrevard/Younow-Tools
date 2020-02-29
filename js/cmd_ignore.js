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
//# sourceMappingURL=cmd_ignore.js.map