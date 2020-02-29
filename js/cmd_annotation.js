"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_log_1 = require("./modules/module_log");
const younow = require("./modules/module_younow");
function cmdAnnotation(user, note) {
    younow.openDB()
        .then(db => {
        user = younow.extractUser(user);
        let userdb = younow.isUsernameInDB(db, user);
        if (userdb) {
            userdb.comment = note;
            db[userdb.userId] = userdb;
            module_log_1.log(`${userdb.profile} in db annotated as ${note}`);
        }
        else {
            younow.resolveUser(db, user)
                .then(function (infos) {
                if (infos.errorCode) {
                    module_log_1.error(`${user} ${infos.errorCode} ${infos.errorMsg}`);
                }
                else {
                    let userdb = younow.convertToUserDB(infos.userId, infos);
                    userdb.comment = note;
                    db[infos.userId] = userdb;
                    module_log_1.log(`${infos.profile} added and annotated as ${note}`);
                }
            })
                .catch(err => {
                module_log_1.error(err);
            });
        }
    })
        .catch(module_log_1.error);
}
exports.cmdAnnotation = cmdAnnotation;
//# sourceMappingURL=cmd_annotation.js.map