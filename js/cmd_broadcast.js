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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kX2Jyb2FkY2FzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2NtZF9icm9hZGNhc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBaUQ7QUFDakQsbURBQWtEO0FBQ2xELGdDQUErQjtBQUUvQixTQUFnQixZQUFZLENBQUMsSUFBYztJQUMxQyxPQUFPLENBQUMsTUFBTSxFQUFFO1NBQ2QsSUFBSSxDQUFDLENBQUMsRUFBTSxFQUFFLEVBQUU7UUFDaEIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsVUFBUyxHQUFRLEVBQUUsT0FBTztZQUNqRCxJQUFJLEdBQUcsR0FBRyxTQUFTLEVBQUU7Z0JBR3BCLGtCQUFLLENBQUMsR0FBRyxHQUFHLDhCQUE4QixDQUFDLENBQUE7Z0JBQzNDLE9BQU8sRUFBRSxDQUFBO2FBQ1Q7aUJBQ0k7Z0JBQ0osT0FBTyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQztxQkFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUNmLElBQUksT0FBTyxDQUFDLFNBQVMsRUFBRTt3QkFDdEIsa0JBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO3FCQUN4RDt5QkFDSTt3QkFDSixPQUFPLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUM7NkJBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTs0QkFDWixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0NBQ25CLGtCQUFLLENBQUMsR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTs2QkFDbEQ7aUNBQ0k7Z0NBR0osT0FBTyxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxHQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUE7NkJBQ25EO3dCQUNGLENBQUMsQ0FBQyxDQUFBO3FCQUNIO2dCQUNGLENBQUMsQ0FBQztxQkFDRCxLQUFLLENBQUMsa0JBQUssQ0FBQztxQkFDWixJQUFJLENBQUMsR0FBRyxFQUFFO29CQUNWLE9BQU8sRUFBRSxDQUFBO2dCQUNWLENBQUMsQ0FBQyxDQUFBO2FBQ0g7UUFDRixDQUFDLENBQUMsQ0FBQTtJQUNILENBQUMsQ0FBQztTQUNELEtBQUssQ0FBQyxrQkFBSyxDQUFDLENBQUE7QUFDZixDQUFDO0FBdENELG9DQXNDQyJ9