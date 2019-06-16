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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kX2Fubm90YXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9jbWRfYW5ub3RhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFEQUFpRDtBQUNqRCxrREFBaUQ7QUFHakQsU0FBZ0IsYUFBYSxDQUFDLElBQVksRUFBRSxJQUFZO0lBQ3ZELE1BQU0sQ0FBQyxNQUFNLEVBQUU7U0FDYixJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDVixJQUFJLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUUvQixJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUU1QyxJQUFJLE1BQU0sRUFBRTtZQUNYLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBO1lBQ3JCLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFBO1lBRTFCLGdCQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsT0FBTyx1QkFBdUIsSUFBSSxFQUFFLENBQUMsQ0FBQTtTQUNuRDthQUNJO1lBQ0osTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDO2lCQUMxQixJQUFJLENBQUMsVUFBUyxLQUFLO2dCQUNuQixJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUU7b0JBQ3BCLGtCQUFLLENBQUMsR0FBRyxJQUFJLElBQUksS0FBSyxDQUFDLFNBQVMsSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtpQkFDckQ7cUJBQ0k7b0JBQ0osSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQXdCLENBQUMsQ0FBQTtvQkFDM0UsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUE7b0JBRXJCLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFBO29CQUV6QixnQkFBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU8sMkJBQTJCLElBQUksRUFBRSxDQUFDLENBQUE7aUJBQ3REO1lBQ0YsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDWixrQkFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ1gsQ0FBQyxDQUFDLENBQUE7U0FDSDtJQUNGLENBQUMsQ0FBQztTQUNELEtBQUssQ0FBQyxrQkFBSyxDQUFDLENBQUE7QUFDZixDQUFDO0FBbENELHNDQWtDQyJ9