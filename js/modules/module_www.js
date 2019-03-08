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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3d3dy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZHVsZXMvbW9kdWxlX3d3dy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsK0JBQThCO0FBQzlCLHlCQUF3QjtBQUN4QixtQ0FBa0M7QUFDbEMsNkNBQWdEO0FBRWhELElBQUksR0FBRyxHQUFRLEtBQUssQ0FBQTtBQUVwQixHQUFHLENBQUMsV0FBVyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUE7QUFDaEMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFBO0FBQ3RDLEdBQUcsQ0FBQyxXQUFXLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQTtBQUVoQztJQUNDLElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUE7SUFDckIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFBO0lBQzdGLE9BQU8sZ0RBQWdELE9BQU8sMkJBQTJCLE9BQU8sRUFBRSxDQUFBO0FBQ25HLENBQUM7QUFKRCxrREFJQztBQUVZLFFBQUEsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQTtBQUVoQyxNQUFNLE1BQU0sR0FBd0I7SUFDbkMsR0FBRyxFQUFFLFdBQUc7SUFDUixrQkFBa0IsRUFBRSxJQUFJO0lBQ3hCLE9BQU8sRUFDUDtRQUNDLFlBQVksRUFBRSxtQkFBbUIsRUFBRTtRQUNuQyxpQkFBaUIsRUFBRSxrQkFBa0I7UUFDcEMsTUFBTSxFQUFFLEtBQUs7S0FDZDtJQUNELElBQUksRUFBRSxJQUFJO0lBQ1YsUUFBUSxFQUFFLElBQUk7Q0FDZCxDQUFBO0FBRUQsa0JBQUssQ0FBQyxNQUFN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