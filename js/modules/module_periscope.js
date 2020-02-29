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
const path = require("path");
const url = require("url");
const module_utils_1 = require("./module_utils");
const module_log_1 = require("./module_log");
const promisify = require("./module_promixified");
const module_hls_1 = require("./module_hls");
const module_www_1 = require("./module_www");
exports.PERISCOPE_URL = "www.pscp.tv";
exports.API = "https://proxsee.pscp.tv/api/v2/";
function getBroadcast(bid) {
    return module_www_1.getURL(`${exports.API}accessVideoPublic?broadcast_id=${bid}`);
}
exports.getBroadcast = getBroadcast;
function createFilename(broadcast) {
    return path.join(global.settings.pathDownload, module_utils_1.cleanFilename(global.settings.filenameTemplate
        .replace("service", "Periscope")
        .replace("country", broadcast.iso_code || broadcast.language || "XX")
        .replace("username", broadcast.username)
        .replace("title", broadcast.status)
        .replace("date", module_utils_1.formatDateTime(new Date(broadcast.created_at)))
        .replace("bid", broadcast.id)
        .replace("type", broadcast.state == "ENDED" ? "replay" : "live")));
}
exports.createFilename = createFilename;
function downloadVideo(filename, video) {
    if (!video.replay_url && !video.https_hls_url) {
        module_log_1.error(module_log_1.prettify(video));
    }
    if (video.replay_url) {
        return new Promise(resolve => {
            module_hls_1.hls(video.replay_url, filename, global.settings.useFFMPEG, video.broadcast.camera_rotation, false, resolve);
        });
    }
    else {
        return new Promise(resolve => {
            module_hls_1.hls(video.https_hls_url, filename, global.settings.useFFMPEG, video.broadcast.camera_rotation, true, resolve);
        });
    }
}
exports.downloadVideo = downloadVideo;
function downloadThumbnail(filename, broadcast) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!broadcast.image_url)
            return false;
        return module_www_1.download(broadcast.image_url, filename);
    });
}
exports.downloadThumbnail = downloadThumbnail;
function downloadProfile(broadcast) {
    return module_www_1.getURL(broadcast.profile_image_url, null)
        .then((data) => {
        return promisify.writeFile(createFilename(broadcast) + ".png", data);
    });
}
exports.downloadProfile = downloadProfile;
function parseURL(user) {
    let u = url.parse(user);
    if (u.hostname) {
        if (u.hostname != exports.PERISCOPE_URL) {
            module_log_1.error(url);
            return null;
        }
        else {
            return user;
        }
    }
    else {
        return `https://${exports.PERISCOPE_URL}/${user}`;
    }
}
exports.parseURL = parseURL;
//# sourceMappingURL=module_periscope.js.map