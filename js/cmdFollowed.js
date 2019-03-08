"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const younow = require("./modules/module_younow");
const module_log_1 = require("./modules/module_log");
function cmdFollowed(users) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield younow.openDB();
        users.forEach(function (user) {
            return __awaiter(this, void 0, void 0, function* () {
                let userinfo = yield younow.resolveUser(db, user);
                let hasNext = 0, start = 0;
                do {
                    let result = yield younow.getFollowed(userinfo.userId, start);
                    if (result.errorCode) {
                        module_log_1.error(younow.errortoString(result));
                        break;
                    }
                    if (start == 0) {
                        module_log_1.log(`#\n# ${userinfo.userId},${userinfo.profile}\n#`);
                    }
                    result.fans.forEach(fan => module_log_1.log(`${fan.userId},${fan.profileUrlString},${fan.firstName},${fan.lastName},${fan.description}`.replace(/[\x00-\x1f]/g, " ")));
                    start += result.count;
                    hasNext = result.hasNext;
                } while (hasNext);
            });
        });
    });
}
exports.cmdFollowed = cmdFollowed;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kRm9sbG93ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9jbWRGb2xsb3dlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsa0RBQWlEO0FBRWpELHFEQUFpRDtBQUVqRCxxQkFBa0MsS0FBZTs7UUFDaEQsSUFBSSxFQUFFLEdBQUcsTUFBTSxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUE7UUFFOUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFlLElBQUk7O2dCQUNoQyxJQUFJLFFBQVEsR0FBRyxNQUFNLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFBO2dCQUNqRCxJQUFJLE9BQU8sR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQTtnQkFFMUIsR0FBRztvQkFDRixJQUFJLE1BQU0sR0FBb0IsTUFBTSxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUE7b0JBRTlFLElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRTt3QkFDckIsa0JBQUssQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7d0JBQ25DLE1BQUs7cUJBQ0w7b0JBRUQsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO3dCQUNmLGdCQUFHLENBQUMsUUFBUSxRQUFRLENBQUMsTUFBTSxJQUFJLFFBQVEsQ0FBQyxPQUFPLEtBQUssQ0FBQyxDQUFBO3FCQUNyRDtvQkFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLGdCQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsSUFBSSxHQUFHLENBQUMsU0FBUyxJQUFJLEdBQUcsQ0FBQyxRQUFRLElBQUksR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO29CQUV6SixLQUFLLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQTtvQkFDckIsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUE7aUJBQ3hCLFFBQVEsT0FBTyxFQUFFO1lBQ25CLENBQUM7U0FBQSxDQUFDLENBQUE7SUFDSCxDQUFDO0NBQUE7QUF6QkQsa0NBeUJDIn0=