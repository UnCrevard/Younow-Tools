"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
//# sourceMappingURL=module_www.js.map