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
const main_1 = require("./main");
const path = require("path");
const url = require("url");
const module_utils_1 = require("./modules/module_utils");
const module_log_1 = require("./modules/module_log");
const promisify = require("./modules/module_promixified");
const module_hls_1 = require("./modules/module_hls");
const module_www_1 = require("./modules/module_www");
exports.PERISCOPE_URL = "www.pscp.tv";
exports.API = "https://proxsee.pscp.tv/api/v2/";
function getBroadcast(bid) {
    return module_www_1.getURL(`${exports.API}/accessVideoPublic?broadcast_id=${bid}`);
}
exports.getBroadcast = getBroadcast;
function createFilename(broadcast) {
    return path.join(main_1.settings.pathDownload, `${broadcast.language || "XX"}_${broadcast.username}_${module_utils_1.formatDateTime(new Date(broadcast.created_at))}${broadcast.state == "ENDED" ? "" : "_live"}_${module_utils_1.cleanFilename(broadcast.status)}`);
}
exports.createFilename = createFilename;
function downloadVideo(filename, video) {
    if (video.replay_url) {
        return new Promise(resolve => {
            module_hls_1.hls(video.replay_url, filename, main_1.settings.useFFMPEG, video.broadcast.camera_rotation, false, resolve);
        });
    }
    else {
        return new Promise(resolve => {
            module_hls_1.hls(video.https_hls_url, filename, main_1.settings.useFFMPEG, video.broadcast.camera_rotation, true, resolve);
        });
    }
}
exports.downloadVideo = downloadVideo;
function downloadThumbnail(broadcast) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!broadcast.image_url)
            return false;
        return module_www_1.download(broadcast.image_url, createFilename(broadcast) + ".jpg");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3BlcmlzY29wZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL21vZHVsZV9wZXJpc2NvcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLGlDQUFpQztBQUNqQyw2QkFBNEI7QUFDNUIsMkJBQTBCO0FBQzFCLHlEQUFzRTtBQUN0RSxxREFBaUQ7QUFDakQsMERBQXlEO0FBQ3pELHFEQUEwQztBQUUxQyxxREFBdUQ7QUFFMUMsUUFBQSxhQUFhLEdBQUcsYUFBYSxDQUFBO0FBQzdCLFFBQUEsR0FBRyxHQUFHLGlDQUFpQyxDQUFBO0FBR3BELHNCQUE2QixHQUFHO0lBRS9CLE9BQU8sbUJBQU0sQ0FBQyxHQUFHLFdBQUcsbUNBQW1DLEdBQUcsRUFBRSxDQUFDLENBQUE7QUFDOUQsQ0FBQztBQUhELG9DQUdDO0FBRUQsd0JBQStCLFNBQThCO0lBQzVELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsU0FBUyxDQUFDLFFBQVEsSUFBSSxJQUFJLElBQUksU0FBUyxDQUFDLFFBQVEsSUFBSSw2QkFBYyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSw0QkFBYSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDaE8sQ0FBQztBQUZELHdDQUVDO0FBRUQsdUJBQThCLFFBQWdCLEVBQUUsS0FBNEI7SUFDM0UsSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFO1FBRXJCLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDNUIsZ0JBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxlQUFRLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUNyRyxDQUFDLENBQUMsQ0FBQTtLQUNGO1NBQ0k7UUFDSixPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzVCLGdCQUFHLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxRQUFRLEVBQUUsZUFBUSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLGVBQWUsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDdkcsQ0FBQyxDQUFDLENBQUE7S0FDRjtBQUNGLENBQUM7QUFaRCxzQ0FZQztBQUVELDJCQUF3QyxTQUE4Qjs7UUFDckUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTO1lBQUUsT0FBTyxLQUFLLENBQUE7UUFFdEMsT0FBTyxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLFNBQVMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFBO0lBQ3pFLENBQUM7Q0FBQTtBQUpELDhDQUlDO0FBRUQseUJBQWdDLFNBQThCO0lBQzdELE9BQU8sbUJBQU0sQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDO1NBQzlDLElBQUksQ0FBQyxDQUFDLElBQVksRUFBRSxFQUFFO1FBQ3RCLE9BQU8sU0FBUyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLEdBQUcsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFBO0lBQ3JFLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQUxELDBDQUtDO0FBRUQsa0JBQXlCLElBQVk7SUFDcEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQVV2QixJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUU7UUFDZixJQUFJLENBQUMsQ0FBQyxRQUFRLElBQUkscUJBQWEsRUFBRTtZQUNoQyxrQkFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ1gsT0FBTyxJQUFJLENBQUE7U0FDWDthQUNJO1lBQ0osT0FBTyxJQUFJLENBQUE7U0FDWDtLQUNEO1NBQ0k7UUFDSixPQUFPLFdBQVcscUJBQWEsSUFBSSxJQUFJLEVBQUUsQ0FBQTtLQUN6QztBQUNGLENBQUM7QUF2QkQsNEJBdUJDIn0=