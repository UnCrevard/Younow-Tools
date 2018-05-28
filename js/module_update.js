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
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3VwZGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL21vZHVsZV91cGRhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFEQUE2QztBQUM3QyxxREFBOEQ7QUFHakQsUUFBQSxXQUFXLEdBQUc7O1FBQzFCLElBQUk7WUFDSCxNQUFNLFFBQVEsR0FBRyxnREFBZ0QsQ0FBQTtZQUVqRSxNQUFNLEtBQUssR0FBWSxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtZQUNqRCxJQUFJLE9BQU8sR0FBWSxNQUFNLG1CQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7WUFFN0MsSUFBSSxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLEVBQUU7Z0JBRXBDLGtCQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQTtnQkFDakMsa0JBQUssQ0FBQyxvQkFBb0IsT0FBTyxDQUFDLElBQUksaUJBQWlCLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO2dCQUN6RSxrQkFBSyxDQUFDLGVBQWUsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUE7Z0JBQ3pDLGtCQUFLLENBQUMsOEJBQThCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFBO2dCQUNuRCxrQkFBSyxDQUFDLDBCQUEwQixDQUFDLENBQUE7YUFDakM7U0FDRDtRQUNELE9BQU8sR0FBRyxFQUFFO1lBQ1gsa0JBQUssQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUE7U0FDekI7SUFDRixDQUFDO0NBQUEsQ0FBQSJ9