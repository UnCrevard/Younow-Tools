"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const younow = require("./modules/module_younow");
const module_log_1 = require("./modules/module_log");
const _async = require("async");
function cmdRemove(users) {
    younow.openDB()
        .then(db => {
        _async.eachSeries(users, function (user, callback) {
            user = younow.extractUser(user);
            let dbuser = younow.isUsernameInDB(db, user);
            if (dbuser) {
                module_log_1.log(`${user} removed from the db`);
                delete db[dbuser.userId];
            }
            else {
                module_log_1.error(`${user} is not in the db`);
                callback();
            }
        });
    })
        .catch(module_log_1.error);
}
exports.cmdRemove = cmdRemove;
//# sourceMappingURL=cmd_remove.js.map