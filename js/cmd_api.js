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
const younow = require("./module_younow");
const module_log_1 = require("./modules/module_log");
function cmdAPI() {
    return __awaiter(this, void 0, void 0, function* () {
        younow.getTrendings()
            .then((trendings) => __awaiter(this, void 0, void 0, function* () {
            if (trendings.errorCode) {
                throw new Error("Fatal");
            }
            module_log_1.log(`getTrendings result:${trendings.errorCode} users:${trendings.trending_users.length}`);
            let user = trendings.trending_users[0];
            let tag = trendings.trending_tags[0];
            let live = yield younow.getLiveBroadcastByUID(user.userId);
            if (live.errorCode) {
                throw new Error("Fatal");
            }
            module_log_1.log(`getLiveBroadcastByUID:${live.errorCode ? live.errorMsg : "OK"}`);
            module_log_1.log(`getLiveBroadcastByUsername:${yield younow.getLiveBroadcastByUsername(user.profile).then(x => x.errorCode ? x.errorMsg : "OK", module_log_1.error)}`);
            module_log_1.log(`getUserInfoByUID:${yield younow.getUserInfoByUID(user.userId).then(x => x.errorCode ? x.errorMsg : "OK", module_log_1.error)}`);
            module_log_1.log(`getTagInfo:${yield younow.getTagInfo(tag.tag).then(x => x.errorCode ? x.errorMsg : "OK", module_log_1.error)}`);
            module_log_1.log(`getMoments:${yield younow.getMoments(user.userId, 0).then(x => x.errorCode ? x.errorMsg : "OK", module_log_1.error)}`);
            module_log_1.log(`getPlaylist:${yield younow.getPlaylist(user.broadcastId).then(x => x.length ? "OK" : "Error", module_log_1.error)}`);
        }))
            .catch(module_log_1.error);
    });
}
exports.cmdAPI = cmdAPI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kX2FwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2NtZF9hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDBDQUF5QztBQUN6QyxxREFBaUQ7QUFHakQ7O1FBQ0MsTUFBTSxDQUFDLFlBQVksRUFBRTthQUNuQixJQUFJLENBQUMsQ0FBTSxTQUFTLEVBQUMsRUFBRTtZQUN2QixJQUFJLFNBQVMsQ0FBQyxTQUFTLEVBQUU7Z0JBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7YUFDeEI7WUFFRCxnQkFBRyxDQUFDLHVCQUF1QixTQUFTLENBQUMsU0FBUyxVQUFVLFNBQVMsQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQTtZQUUxRixJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3RDLElBQUksR0FBRyxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDcEMsSUFBSSxJQUFJLEdBQUcsTUFBTSxNQUFNLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBRTFELElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTthQUN4QjtZQUVELGdCQUFHLENBQUMseUJBQXlCLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7WUFDckUsZ0JBQUcsQ0FBQyw4QkFBOEIsTUFBTSxNQUFNLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxrQkFBSyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQzVJLGdCQUFHLENBQUMsb0JBQW9CLE1BQU0sTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsa0JBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUN2SCxnQkFBRyxDQUFDLGNBQWMsTUFBTSxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsa0JBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUN2RyxnQkFBRyxDQUFDLGNBQWMsTUFBTSxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLGtCQUFLLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDOUcsZ0JBQUcsQ0FBQyxlQUFlLE1BQU0sTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsa0JBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUk3RyxDQUFDLENBQUEsQ0FBQzthQUNELEtBQUssQ0FBQyxrQkFBSyxDQUFDLENBQUE7SUFDZixDQUFDO0NBQUE7QUE1QkQsd0JBNEJDIn0=