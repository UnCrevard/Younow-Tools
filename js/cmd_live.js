"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_log_1 = require("./modules/module_log");
const _younow = require("./module_younow");
const _async = require("async");
function cmdLive(users) {
    _younow.openDB()
        .then((db) => {
        _async.eachSeries(users, function (user, cbAsync) {
            user = _younow.extractUser(user);
            let p = isNaN(user) ? _younow.getLiveBroadcastByUsername(user) : _younow.getLiveBroadcastByUID(user);
            p.then(live => {
                if (live.errorCode) {
                    module_log_1.error(`${user} ${live.errorCode} ${live.errorMsg}`);
                }
                else if (live.state != "onBroadcastPlay") {
                    module_log_1.error(`${live.state} ${live.stateCopy}`);
                }
                else {
                    _younow.downloadThemAll(live)
                        .then(result => {
                        module_log_1.log(`${live.profile} broadcast is over`);
                        return true;
                    }, module_log_1.error);
                }
            }, module_log_1.error)
                .then(() => {
                cbAsync();
            });
        });
    })
        .catch(module_log_1.error);
}
exports.cmdLive = cmdLive;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kX2xpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9jbWRfbGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHFEQUFpRDtBQUNqRCwyQ0FBMEM7QUFDMUMsZ0NBQStCO0FBRS9CLGlCQUF3QixLQUFlO0lBQ3RDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7U0FDZCxJQUFJLENBQUMsQ0FBQyxFQUFNLEVBQUUsRUFBRTtRQUNoQixNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxVQUFTLElBQUksRUFBRSxPQUFPO1lBQzlDLElBQUksR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBRWhDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUE7WUFFcEcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDYixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQ25CLGtCQUFLLENBQUMsR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtpQkFDbkQ7cUJBQ0ksSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLGlCQUFpQixFQUFFO29CQUN6QyxrQkFBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQTtpQkFDeEM7cUJBQ0k7b0JBQ0osT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUM7eUJBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTt3QkFDZCxnQkFBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sb0JBQW9CLENBQUMsQ0FBQTt3QkFDeEMsT0FBTyxJQUFJLENBQUE7b0JBQ1osQ0FBQyxFQUFFLGtCQUFLLENBQUMsQ0FBQTtpQkFDVjtZQUNGLENBQUMsRUFBRSxrQkFBSyxDQUFDO2lCQUNQLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQ1YsT0FBTyxFQUFFLENBQUE7WUFDVixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0gsQ0FBQyxDQUFDO1NBQ0QsS0FBSyxDQUFDLGtCQUFLLENBQUMsQ0FBQTtBQUdmLENBQUM7QUEvQkQsMEJBK0JDIn0=