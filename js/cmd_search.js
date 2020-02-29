"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_log_1 = require("./modules/module_log");
const younow = require("./modules/module_younow");
const _async = require("async");
function cmdSearch(patterns) {
    younow.openDB()
        .then(db => {
        _async.eachSeries(patterns, function (user, callback) {
            user = younow.extractUser(user);
            let regex = new RegExp(user, "i");
            Object.keys(db).forEach(key => {
                let dbuser = db[key];
                if (dbuser.userId) {
                    if (JSON.stringify(dbuser).match(regex)) {
                        let profile = dbuser.profile || "?";
                        module_log_1.log(`${profile} (from db)`);
                        module_log_1.log(module_log_1.prettify(dbuser));
                    }
                }
            });
            callback();
        });
    })
        .catch(module_log_1.error);
}
exports.cmdSearch = cmdSearch;
function cmdResolve(users) {
    younow.openDB()
        .then(db => {
        _async.eachSeries(users, function (user, callback) {
            user = younow.extractUser(user);
            younow.resolveUser(db, user)
                .then(infos => {
                module_log_1.log(`${user} (online result)`);
                module_log_1.log(module_log_1.prettify(infos));
                callback();
            })
                .catch(err => {
                module_log_1.error(err);
                callback();
            });
        });
    })
        .catch(module_log_1.error);
}
exports.cmdResolve = cmdResolve;
//# sourceMappingURL=cmd_search.js.map