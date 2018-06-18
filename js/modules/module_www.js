"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https = require("https");
const fs = require("fs");
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
function download(url, filename) {
    return new Promise((resolve, reject) => {
        exports.req(url)
            .on("error", err => {
            reject(err);
        })
            .on("end", err => {
            resolve(err);
        })
            .pipe(fs.createWriteStream(filename));
    });
}
exports.download = download;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3d3dy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZHVsZXMvbW9kdWxlX3d3dy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUE4QjtBQUM5Qix5QkFBd0I7QUFDeEIsbUNBQWtDO0FBQ2xDLDZDQUEyQztBQUUzQyxJQUFJLEdBQUcsR0FBUSxLQUFLLENBQUE7QUFFcEIsR0FBRyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFBO0FBQ2hDLEdBQUcsQ0FBQyxXQUFXLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQTtBQUN0QyxHQUFHLENBQUMsV0FBVyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUE7QUFFaEM7SUFDQyxJQUFJLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFBO0lBQ3JCLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQTtJQUM3RixPQUFPLGdEQUFnRCxPQUFPLDJCQUEyQixPQUFPLEVBQUUsQ0FBQTtBQUNuRyxDQUFDO0FBRVksUUFBQSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFBO0FBRWhDLE1BQU0sTUFBTSxHQUF3QjtJQUNuQyxHQUFHLEVBQUUsV0FBRztJQUNSLE9BQU8sRUFDUDtRQUNDLFlBQVksRUFBRSxtQkFBbUIsRUFBRTtRQUNuQyxpQkFBaUIsRUFBRSxrQkFBa0I7S0FDckM7SUFDRCxJQUFJLEVBQUUsSUFBSTtJQUNWLFFBQVEsRUFBRSxJQUFJO0NBQ2QsQ0FBQTtBQUVELGtCQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7QUFFQSxRQUFBLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxD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