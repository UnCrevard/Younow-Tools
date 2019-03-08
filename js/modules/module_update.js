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
const module_www_1 = require("../modules/module_www");
const module_log_1 = require("../modules/module_log");
exports.checkUpdate = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const registry = `https://registry.npmjs.org/younow-tools/latest`;
            const local = require("../package.json");
            let current = yield module_www_1.getURL(registry);
            if (local.version < current.version) {
                module_log_1.error("#\n#\n#\n#\n#\n#\n#\n#");
                module_log_1.error(`A new version of ${current.name} is available ${current.version}`);
                if (current.version in current.changelog) {
                    module_log_1.log(current.changelog[current.version].join("\n"));
                }
                module_log_1.error(`Update with npm -g install ${current.name}`);
                module_log_1.error("#\n#\n#\n#\n#\n#\n#\n#");
            }
        }
        catch (err) {
            module_log_1.error("update fail", err);
        }
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3VwZGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZHVsZXMvbW9kdWxlX3VwZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsc0RBQThDO0FBQzlDLHNEQUErRDtBQUdsRCxRQUFBLFdBQVcsR0FBRzs7UUFDMUIsSUFBSTtZQUNILE1BQU0sUUFBUSxHQUFHLGdEQUFnRCxDQUFBO1lBRWpFLE1BQU0sS0FBSyxHQUFZLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO1lBQ2pELElBQUksT0FBTyxHQUFZLE1BQU0sbUJBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUU3QyxJQUFJLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRTtnQkFFcEMsa0JBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO2dCQUMvQixrQkFBSyxDQUFDLG9CQUFvQixPQUFPLENBQUMsSUFBSSxpQkFBaUIsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7Z0JBRXpFLElBQUksT0FBTyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFO29CQUN6QyxnQkFBRyxDQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO2lCQUMzRDtnQkFDRCxrQkFBSyxDQUFDLDhCQUE4QixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTtnQkFDbkQsa0JBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO2FBQy9CO1NBQ0Q7UUFDRCxPQUFPLEdBQUcsRUFBRTtZQUNYLGtCQUFLLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxDQUFBO1NBQ3pCO0lBQ0YsQ0FBQztDQUFBLENBQUEifQ==