"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https = require("https");
const Request = require("request");
const module_log_1 = require("./module_log");
var fix = https;
fix.globalAgent.keepAlive = true;
fix.globalAgent.keepAliveMsecs = 10000;
fix.globalAgent.maxSockets = 100;
function getFirefoxUserAgent() {
    let date = new Date();
    let version = ((date.getFullYear() - 2018) * 4 + Math.floor(date.getMonth() / 4) + 58) + ".0";
    return `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:${version} Gecko/20100101 Firefox/${version}`;
}
exports.jar = Request.jar();
const config = {
    jar: exports.jar,
    headers: {
        "user-agent": getFirefoxUserAgent(),
        "Accept-Language": "en-us, en; q=0.5"
    },
    gzip: true,
    encoding: null
};
module_log_1.debug(config);
exports.req = Request.defaults(config);
function getURL(url, encoding = "json") {
    module_log_1.debug(url, encoding);
    return new Promise(function (resolve, reject) {
        if (!url || url.length == 0) {
            module_log_1.error(`getURL ${url}`);
            reject(-1);
            return;
        }
        exports.req.get(url, function (err, res, body) {
            if (err) {
                module_log_1.error(`NET ${err} ${url}`);
                reject(err);
            }
            else if (res.statusCode != 200) {
                module_log_1.error(`NET ${res.statusCode} ${url}`);
                reject(res.statusCode);
            }
            else {
                module_log_1.debug(`NET:statusCode:${res.statusCode} Type:${typeof body} Len:${body && body.length} URL:${url}`);
                var data;
                try {
                    switch (encoding) {
                        case "json":
                            data = JSON.parse(body.toString());
                            break;
                        case null:
                            data = body;
                            break;
                        default:
                            data = body.toString(encoding);
                    }
                    resolve(data);
                }
                catch (e) {
                    module_log_1.error(__filename, `NET:encoding as ${encoding} ${e}`);
                    reject(-1);
                }
            }
        });
    });
}
exports.getURL = getURL;
function post(url, form) {
    return new Promise((resolve, reject) => {
        exports.req.post(url, form, (err, res, body) => {
            if (err) {
                module_log_1.error(`${err} ${url}`);
                reject(err);
            }
            else {
                resolve(body);
            }
        });
    });
}
exports.post = post;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3d3dy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZHVsZXMvbW9kdWxlX3d3dy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUE4QjtBQUU5QixtQ0FBa0M7QUFDbEMsNkNBQTJDO0FBRTNDLElBQUksR0FBRyxHQUFRLEtBQUssQ0FBQTtBQUVwQixHQUFHLENBQUMsV0FBVyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUE7QUFDaEMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFBO0FBQ3RDLEdBQUcsQ0FBQyxXQUFXLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQTtBQUVoQztJQUNDLElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUE7SUFDckIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFBO0lBQzdGLE9BQU8sZ0RBQWdELE9BQU8sMkJBQTJCLE9BQU8sRUFBRSxDQUFBO0FBQ25HLENBQUM7QUFFWSxRQUFBLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUE7QUFFaEMsTUFBTSxNQUFNLEdBQXdCO0lBQ25DLEdBQUcsRUFBRSxXQUFHO0lBQ1IsT0FBTyxFQUNQO1FBQ0MsWUFBWSxFQUFFLG1CQUFtQixFQUFFO1FBQ25DLGlCQUFpQixFQUFFLGtCQUFrQjtLQUNyQztJQUNELElBQUksRUFBRSxJQUFJO0lBQ1YsUUFBUSxFQUFFLElBQUk7Q0FDZCxDQUFBO0FBRUQsa0JBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUVBLFFBQUEsR0FBRyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUE7QUFFM0MsZ0JBQXVCLEdBQUcsRUFBRSxRQUFRLEdBQUcsTUFBTTtJQUM1QyxrQkFBSyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUVwQixPQUFPLElBQUksT0FBTyxDQUFDLFVBQVMsT0FBTyxFQUFFLE1BQU07UUFDMUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUM1QixrQkFBSyxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUMsQ0FBQTtZQUN0QixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNWLE9BQU07U0FDTjtRQUVELFdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFVBQVMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFZO1lBQzNDLElBQUksR0FBRyxFQUFFO2dCQUNSLGtCQUFLLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQTtnQkFDMUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2FBQ1g7aUJBQ0ksSUFBSSxHQUFHLENBQUMsVUFBVSxJQUFJLEdBQUcsRUFBRTtnQkFDL0Isa0JBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxVQUFVLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQTtnQkFDckMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQTthQUN0QjtpQkFDSTtnQkFDSixrQkFBSyxDQUFDLGtCQUFrQixHQUFHLENBQUMsVUFBVSxTQUFTLE9BQU8sSUFBSSxRQUFRLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLENBQUE7Z0JBRW5HLElBQUksSUFBUyxDQUFBO2dCQUViLElBQUk7b0JBQ0gsUUFBUSxRQUFRLEVBQUU7d0JBQ2pCLEtBQUssTUFBTTs0QkFDVixJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTs0QkFDbEMsTUFBSzt3QkFFTixLQUFLLElBQUk7NEJBQ1IsSUFBSSxHQUFHLElBQUksQ0FBQTs0QkFDWCxNQUFLO3dCQUVOOzRCQUNDLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO3FCQUMvQjtvQkFFRCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7aUJBQ2I7Z0JBQ0QsT0FBTyxDQUFDLEVBQUU7b0JBQ1Qsa0JBQUssQ0FBQyxVQUFVLEVBQUUsbUJBQW1CLFFBQVEsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO29CQUNyRCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtpQkFDVjthQUNEO1FBQ0YsQ0FBQyxDQUFDLENBQUE7SUFDSCxDQUFDLENBQUMsQ0FBQTtBQUNILENBQUM7QUEvQ0Qsd0JBK0NDO0FBRUQsY0FBcUIsR0FBRyxFQUFFLElBQUk7SUFDN0IsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUN0QyxXQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ3RDLElBQUksR0FBRyxFQUFFO2dCQUNSLGtCQUFLLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQTtnQkFDdEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2FBQ1g7aUJBQ0k7Z0JBQ0osT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO2FBQ2I7UUFDRixDQUFDLENBQUMsQ0FBQTtJQUNILENBQUMsQ0FBQyxDQUFBO0FBQ0gsQ0FBQztBQVpELG9CQVlDIn0=