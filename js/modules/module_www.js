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
exports.getFirefoxUserAgent = getFirefoxUserAgent;
exports.jar = Request.jar();
const config = {
    jar: exports.jar,
    headers: {
        "user-agent": getFirefoxUserAgent(),
        "Accept-Language": "en-us, en; q=0.5",
        Accept: "*/*"
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
            module_log_1.error("download.req", err);
            reject(err);
        })
            .on("end", err => {
        })
            .pipe(fs.createWriteStream(filename))
            .on("error", err => {
            module_log_1.error("download.pipe", err);
            reject(err);
        })
            .on("finish", resolve);
    });
}
exports.download = download;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3d3dy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZHVsZXMvbW9kdWxlX3d3dy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUE4QjtBQUM5Qix5QkFBd0I7QUFDeEIsbUNBQWtDO0FBQ2xDLDZDQUFnRDtBQUVoRCxJQUFJLEdBQUcsR0FBUSxLQUFLLENBQUE7QUFFcEIsR0FBRyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFBO0FBQ2hDLEdBQUcsQ0FBQyxXQUFXLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQTtBQUN0QyxHQUFHLENBQUMsV0FBVyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUE7QUFFaEM7SUFDQyxJQUFJLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFBO0lBQ3JCLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQTtJQUM3RixPQUFPLGdEQUFnRCxPQUFPLDJCQUEyQixPQUFPLEVBQUUsQ0FBQTtBQUNuRyxDQUFDO0FBSkQsa0RBSUM7QUFFWSxRQUFBLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUE7QUFFaEMsTUFBTSxNQUFNLEdBQXdCO0lBQ25DLEdBQUcsRUFBRSxXQUFHO0lBQ1IsT0FBTyxFQUNQO1FBQ0MsWUFBWSxFQUFFLG1CQUFtQixFQUFFO1FBQ25DLGlCQUFpQixFQUFFLGtCQUFrQjtRQUNwQyxNQUFNLEVBQUMsS0FBSztLQUNiO0lBQ0QsSUFBSSxFQUFFLElBQUk7SUFDVixRQUFRLEVBQUUsSUFBSTtDQUNkLENBQUE7QUFFRCxrQkFBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBRUEsUUFBQSxHQUFHLEdBQUcs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