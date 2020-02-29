"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_log_1 = require("./modules/module_log");
const _younow = require("./modules/module_younow");
const _async = require("async");
function cmdBroadcast(bids) {
    _younow.openDB()
        .then((db) => {
        _async.eachSeries(bids, function (bid, cbAsync) {
            if (bid < 107942269) {
                module_log_1.error(`${bid} 263 Replay no longer exists`);
                cbAsync();
            }
            else {
                _younow.getArchivedBroadcast(bid)
                    .then(archive => {
                    if (archive.errorCode) {
                        module_log_1.error(`${bid} ${archive.errorCode} ${archive.errorMsg}`);
                    }
                    else {
                        return _younow.resolveUser(db, archive.userId)
                            .then(user => {
                            if (user.errorCode) {
                                module_log_1.error(`${bid} ${user.errorCode} ${user.errorMsg}`);
                            }
                            else {
                                return _younow.downloadArchive(user, bid, 0);
                            }
                        });
                    }
                })
                    .catch(module_log_1.error)
                    .then(() => {
                    cbAsync();
                });
            }
        });
    })
        .catch(module_log_1.error);
}
exports.cmdBroadcast = cmdBroadcast;
//# sourceMappingURL=cmd_broadcast.js.map