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
const module_www_1 = require("./modules/module_www");
const module_log_1 = require("./modules/module_log");
const module_utils_1 = require("./modules/module_utils");
exports.checkUpdate = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const registry = `https://registry.npmjs.org/younow-tools/latest`;
            const local = require("../package.json");
            let current = yield module_www_1.getURL(registry);
            if (local.version < current.version) {
                module_log_1.error("#\n#\n#\n#\n#\n#\n#\n#\n");
                module_log_1.error(`A new version of ${current.name} is available ${current.version}`);
                module_log_1.error(`Changelog : ${current.changelog}`);
                module_log_1.error(`Update with npm -g install ${current.name}`);
                module_log_1.error("#\n#\n#\n#\n#\n#\n#\n#\n");
            }
        }
        catch (err) {
            module_log_1.error("update fail", err);
        }
        setTimeout(module_utils_1.Time.HOUR, exports.checkUpdate);
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3VwZGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL21vZHVsZV91cGRhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFEQUE2QztBQUM3QyxxREFBOEQ7QUFDOUQseURBQTZDO0FBRWhDLFFBQUEsV0FBVyxHQUFHOztRQUMxQixJQUFJO1lBQ0gsTUFBTSxRQUFRLEdBQUcsZ0RBQWdELENBQUE7WUFFakUsTUFBTSxLQUFLLEdBQVksT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUE7WUFDakQsSUFBSSxPQUFPLEdBQVksTUFBTSxtQkFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBRTdDLElBQUksS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFO2dCQUVwQyxrQkFBSyxDQUFDLDBCQUEwQixDQUFDLENBQUE7Z0JBQ2pDLGtCQUFLLENBQUMsb0JBQW9CLE9BQU8sQ0FBQyxJQUFJLGlCQUFpQixPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQTtnQkFDekUsa0JBQUssQ0FBQyxlQUFlLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFBO2dCQUN6QyxrQkFBSyxDQUFDLDhCQUE4QixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTtnQkFDbkQsa0JBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO2FBQ2pDO1NBQ0Q7UUFDRCxPQUFPLEdBQUcsRUFBRTtZQUNYLGtCQUFLLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxDQUFBO1NBQ3pCO1FBRUQsVUFBVSxDQUFDLG1CQUFJLENBQUMsSUFBSSxFQUFFLG1CQUFXLENBQUMsQ0FBQTtJQUNuQyxDQUFDO0NBQUEsQ0FBQSJ9