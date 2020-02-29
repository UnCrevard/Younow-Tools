"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_www_1 = require("./module_www");
const module_hls_1 = require("./module_hls");
const module_utils_1 = require("./module_utils");
const _path = require("path");
function getBroadcast(url) {
    return module_www_1.getURL(url, null)
        .then(body => {
        let m = body.toString().match(/playerParams.=.(.+?);\n/);
        if (!m)
            throw "no playerParams";
        let json = JSON.parse(m[1]);
        return json.params[0];
    });
}
exports.getBroadcast = getBroadcast;
function downloadBroadcast(basename, broadcast) {
    if (broadcast.mp4 || broadcast.postlive_mp4) {
        return module_www_1.download(broadcast.mp4 || broadcast.postlive_mp4, basename + ".mp4");
    }
    else if (broadcast.hls) {
        return new Promise((resolve, reject) => {
            module_hls_1.hls(broadcast.hls, basename + ".ts", global.settings.useFFMPEG, 0, true, resolve);
        });
    }
    else {
        throw "no hls stream";
    }
}
exports.downloadBroadcast = downloadBroadcast;
function CreateFilename(broadcast) {
    return _path.join(global.settings.pathDownload, module_utils_1.cleanFilename(global.settings.filenameTemplate
        .replace("country", "RU")
        .replace("username", broadcast.md_author)
        .replace("title", broadcast.md_title)
        .replace("date", module_utils_1.formatDateTime(new Date(broadcast.date * module_utils_1.Time.MILLI)))
        .replace("bid", broadcast.vid.toString())
        .replace("service", "Vk")
        .replace("type", broadcast.postlive_mp4 ? "replay" : "live")));
}
exports.CreateFilename = CreateFilename;
//# sourceMappingURL=module_vk.js.map