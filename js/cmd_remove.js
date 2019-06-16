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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kX3JlbW92ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2NtZF9yZW1vdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxrREFBaUQ7QUFDakQscURBQXVEO0FBQ3ZELGdDQUErQjtBQUUvQixTQUFnQixTQUFTLENBQUMsS0FBZTtJQUN4QyxNQUFNLENBQUMsTUFBTSxFQUFFO1NBQ2IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQ1YsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsVUFBUyxJQUFZLEVBQUUsUUFBUTtZQUN2RCxJQUFJLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUUvQixJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQTtZQUU1QyxJQUFJLE1BQU0sRUFBRTtnQkFDWCxnQkFBRyxDQUFDLEdBQUcsSUFBSSxzQkFBc0IsQ0FBQyxDQUFBO2dCQUNsQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7YUFDeEI7aUJBQ0k7Z0JBQ0osa0JBQUssQ0FBQyxHQUFHLElBQUksbUJBQW1CLENBQUMsQ0FBQTtnQkFDakMsUUFBUSxFQUFFLENBQUE7YUFDVjtRQUNGLENBQUMsQ0FBQyxDQUFBO0lBQ0gsQ0FBQyxDQUFDO1NBQ0QsS0FBSyxDQUFDLGtCQUFLLENBQUMsQ0FBQTtBQUNmLENBQUM7QUFuQkQsOEJBbUJDIn0=