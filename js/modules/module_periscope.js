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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3BlcmlzY29wZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZHVsZXMvbW9kdWxlX3BlcmlzY29wZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUEsNkJBQTRCO0FBQzVCLDJCQUEwQjtBQUMxQixpREFBOEQ7QUFDOUQsNkNBQWtEO0FBQ2xELGtEQUFpRDtBQUNqRCw2Q0FBa0M7QUFFbEMsNkNBQStDO0FBRWxDLFFBQUEsYUFBYSxHQUFHLGFBQWEsQ0FBQTtBQUM3QixRQUFBLEdBQUcsR0FBRyxpQ0FBaUMsQ0FBQTtBQUVwRCxTQUFnQixZQUFZLENBQUMsR0FBRztJQUUvQixPQUFPLG1CQUFNLENBQUMsR0FBRyxXQUFHLGtDQUFrQyxHQUFHLEVBQUUsQ0FBQyxDQUFBO0FBQzdELENBQUM7QUFIRCxvQ0FHQztBQUVELFNBQWdCLGNBQWMsQ0FBQyxTQUE4QjtJQUU1RCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUMsNEJBQWEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGdCQUFnQjtTQUMxRixPQUFPLENBQUMsU0FBUyxFQUFDLFdBQVcsQ0FBQztTQUM5QixPQUFPLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxRQUFRLElBQUUsU0FBUyxDQUFDLFFBQVEsSUFBRSxJQUFJLENBQUM7U0FDaEUsT0FBTyxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDO1NBQ3ZDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQztTQUNsQyxPQUFPLENBQUMsTUFBTSxFQUFFLDZCQUFjLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7U0FDL0QsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsRUFBRSxDQUFDO1NBQzVCLE9BQU8sQ0FBQyxNQUFNLEVBQUMsU0FBUyxDQUFDLEtBQUssSUFBRSxPQUFPLENBQUEsQ0FBQyxDQUFBLFFBQVEsQ0FBQSxDQUFDLENBQUEsTUFBTSxDQUFDLENBQ3hELENBQUMsQ0FBQTtBQUNKLENBQUM7QUFYRCx3Q0FXQztBQUVELFNBQWdCLGFBQWEsQ0FBQyxRQUFnQixFQUFFLEtBQTRCO0lBRTNFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFDN0M7UUFDQyxrQkFBSyxDQUFDLHFCQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtLQUN0QjtJQUVELElBQUksS0FBSyxDQUFDLFVBQVUsRUFBRTtRQUVyQixPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzVCLGdCQUFHLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQzVHLENBQUMsQ0FBQyxDQUFBO0tBQ0Y7U0FDSTtRQUNKLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDNUIsZ0JBQUcsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLGVBQWUsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDOUcsQ0FBQyxDQUFDLENBQUE7S0FDRjtBQUNGLENBQUM7QUFsQkQsc0NBa0JDO0FBRUQsU0FBc0IsaUJBQWlCLENBQUMsUUFBUSxFQUFFLFNBQThCOztRQUUvRSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVM7WUFBRSxPQUFPLEtBQUssQ0FBQTtRQUV0QyxPQUFPLHFCQUFRLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUMvQyxDQUFDO0NBQUE7QUFMRCw4Q0FLQztBQUVELFNBQWdCLGVBQWUsQ0FBQyxTQUE4QjtJQUM3RCxPQUFPLG1CQUFNLENBQUMsU0FBUyxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQztTQUM5QyxJQUFJLENBQUMsQ0FBQyxJQUFZLEVBQUUsRUFBRTtRQUN0QixPQUFPLFNBQVMsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxHQUFHLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUNyRSxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFMRCwwQ0FLQztBQUVELFNBQWdCLFFBQVEsQ0FBQyxJQUFZO0lBQ3BDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7SUFVdkIsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFO1FBQ2YsSUFBSSxDQUFDLENBQUMsUUFBUSxJQUFJLHFCQUFhLEVBQUU7WUFDaEMsa0JBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNYLE9BQU8sSUFBSSxDQUFBO1NBQ1g7YUFDSTtZQUNKLE9BQU8sSUFBSSxDQUFBO1NBQ1g7S0FDRDtTQUNJO1FBQ0osT0FBTyxXQUFXLHFCQUFhLElBQUksSUFBSSxFQUFFLENBQUE7S0FDekM7QUFDRixDQUFDO0FBdkJELDRCQXVCQyJ9