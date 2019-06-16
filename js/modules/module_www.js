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
    followAllRedirects: true,
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
    return __awaiter(this, void 0, void 0, function* () {
        module_log_1.debug(url, encoding);
        if (!url)
            throw "getURL : empty url";
        if (!(encoding === null || encoding === "utf-8" || encoding == "utf8" || encoding === "json"))
            throw `getURL : bad encoding ${encoding}`;
        return new Promise(function (resolve, reject) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3d3dy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZHVsZXMvbW9kdWxlX3d3dy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsK0JBQThCO0FBQzlCLHlCQUF3QjtBQUN4QixtQ0FBa0M7QUFDbEMsNkNBQWdEO0FBRWhELElBQUksR0FBRyxHQUFRLEtBQUssQ0FBQTtBQUVwQixHQUFHLENBQUMsV0FBVyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUE7QUFDaEMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFBO0FBQ3RDLEdBQUcsQ0FBQyxXQUFXLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQTtBQUVoQyxTQUFnQixtQkFBbUI7SUFDbEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQTtJQUNyQixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUE7SUFDN0YsT0FBTyxnREFBZ0QsT0FBTywyQkFBMkIsT0FBTyxFQUFFLENBQUE7QUFDbkcsQ0FBQztBQUpELGtEQUlDO0FBRVksUUFBQSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFBO0FBRWhDLE1BQU0sTUFBTSxHQUF3QjtJQUNuQyxHQUFHLEVBQUUsV0FBRztJQUNSLGtCQUFrQixFQUFFLElBQUk7SUFDeEIsT0FBTyxFQUNQO1FBQ0MsWUFBWSxFQUFFLG1CQUFtQixFQUFFO1FBQ25DLGlCQUFpQixFQUFFLGtCQUFrQjtRQUNwQyxNQUFNLEVBQUUsS0FBSztLQUNkO0lBQ0QsSUFBSSxFQUFFLElBQUk7SUFDVixRQUFRLEVBQUUsSUFBSTtDQUNkLENBQUE7QUFFRCxr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