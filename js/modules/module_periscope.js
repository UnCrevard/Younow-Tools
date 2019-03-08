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
    return `${broadcast.language || "XX"}_${broadcast.username}_${module_utils_1.formatDateTime(new Date(broadcast.created_at))}${broadcast.state == "ENDED" ? "" : "_live"}_${module_utils_1.cleanFilename(broadcast.status)}`;
}
exports.createFilename = createFilename;
function downloadVideo(filename, video) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3BlcmlzY29wZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZHVsZXMvbW9kdWxlX3BlcmlzY29wZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0EsMkJBQTBCO0FBQzFCLGlEQUE4RDtBQUM5RCw2Q0FBeUM7QUFDekMsa0RBQWlEO0FBQ2pELDZDQUFrQztBQUVsQyw2Q0FBK0M7QUFFbEMsUUFBQSxhQUFhLEdBQUcsYUFBYSxDQUFBO0FBQzdCLFFBQUEsR0FBRyxHQUFHLGlDQUFpQyxDQUFBO0FBR3BELHNCQUE2QixHQUFHO0lBRS9CLE9BQU8sbUJBQU0sQ0FBQyxHQUFHLFdBQUcsa0NBQWtDLEdBQUcsRUFBRSxDQUFDLENBQUE7QUFDN0QsQ0FBQztBQUhELG9DQUdDO0FBRUQsd0JBQStCLFNBQThCO0lBQzVELE9BQU8sR0FBRyxTQUFTLENBQUMsUUFBUSxJQUFJLElBQUksSUFBSSxTQUFTLENBQUMsUUFBUSxJQUFJLDZCQUFjLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLDRCQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUE7QUFDOUwsQ0FBQztBQUZELHdDQUVDO0FBRUQsdUJBQThCLFFBQWdCLEVBQUUsS0FBNEI7SUFDM0UsSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFO1FBRXJCLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDNUIsZ0JBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLGVBQWUsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDNUcsQ0FBQyxDQUFDLENBQUE7S0FDRjtTQUNJO1FBQ0osT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUM1QixnQkFBRyxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUM5RyxDQUFDLENBQUMsQ0FBQTtLQUNGO0FBQ0YsQ0FBQztBQVpELHNDQVlDO0FBRUQsMkJBQXdDLFFBQVEsRUFBRSxTQUE4Qjs7UUFFL0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTO1lBQUUsT0FBTyxLQUFLLENBQUE7UUFFdEMsT0FBTyxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDL0MsQ0FBQztDQUFBO0FBTEQsOENBS0M7QUFFRCx5QkFBZ0MsU0FBOEI7SUFDN0QsT0FBTyxtQkFBTSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUM7U0FDOUMsSUFBSSxDQUFDLENBQUMsSUFBWSxFQUFFLEVBQUU7UUFDdEIsT0FBTyxTQUFTLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsR0FBRyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDckUsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDO0FBTEQsMENBS0M7QUFFRCxrQkFBeUIsSUFBWTtJQUNwQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBVXZCLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRTtRQUNmLElBQUksQ0FBQyxDQUFDLFFBQVEsSUFBSSxxQkFBYSxFQUFFO1lBQ2hDLGtCQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDWCxPQUFPLElBQUksQ0FBQTtTQUNYO2FBQ0k7WUFDSixPQUFPLElBQUksQ0FBQTtTQUNYO0tBQ0Q7U0FDSTtRQUNKLE9BQU8sV0FBVyxxQkFBYSxJQUFJLElBQUksRUFBRSxDQUFBO0tBQ3pDO0FBQ0YsQ0FBQztBQXZCRCw0QkF1QkMifQ==