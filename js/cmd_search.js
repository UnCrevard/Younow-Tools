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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kX3NlYXJjaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2NtZF9zZWFyY2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBd0U7QUFDeEUsa0RBQWlEO0FBQ2pELGdDQUErQjtBQUUvQixTQUFnQixTQUFTLENBQUMsUUFBa0I7SUFDM0MsTUFBTSxDQUFDLE1BQU0sRUFBRTtTQUNiLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUNWLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUN6QixVQUFTLElBQUksRUFBRSxRQUFRO1lBQ3RCLElBQUksR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBRS9CLElBQUksS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUlqQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDN0IsSUFBSSxNQUFNLEdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUU1QixJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7b0JBQ2xCLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7d0JBQ3hDLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLElBQUksR0FBRyxDQUFBO3dCQUVuQyxnQkFBRyxDQUFDLEdBQUcsT0FBTyxZQUFZLENBQUMsQ0FBQTt3QkFDM0IsZ0JBQUcsQ0FBQyxxQkFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7cUJBQ3JCO2lCQUNEO1lBQ0YsQ0FBQyxDQUFDLENBQUE7WUFFRixRQUFRLEVBQUUsQ0FBQTtRQUNYLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDO1NBQ0QsS0FBSyxDQUFDLGtCQUFLLENBQUMsQ0FBQTtBQUNmLENBQUM7QUE1QkQsOEJBNEJDO0FBRUQsU0FBZ0IsVUFBVSxDQUFDLEtBQWU7SUFDekMsTUFBTSxDQUFDLE1BQU0sRUFBRTtTQUNiLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUNWLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUN0QixVQUFTLElBQUksRUFBRSxRQUFRO1lBQ3RCLElBQUksR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQy9CLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQztpQkFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNiLGdCQUFHLENBQUMsR0FBRyxJQUFJLGtCQUFrQixDQUFDLENBQUE7Z0JBQzlCLGdCQUFHLENBQUMscUJBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO2dCQUNwQixRQUFRLEVBQUUsQ0FBQTtZQUNYLENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ1osa0JBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDVixRQUFRLEVBQUUsQ0FBQTtZQUNYLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUM7U0FDRCxLQUFLLENBQUMsa0JBQUssQ0FBQyxDQUFBO0FBQ2YsQ0FBQztBQW5CRCxnQ0FtQkMifQ==