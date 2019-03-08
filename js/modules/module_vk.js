"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_www_1 = require("./module_www");
const module_hls_1 = require("./module_hls");
const module_utils_1 = require("./module_utils");
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
    return module_utils_1.cleanFilename(global.settings.filenameTemplate
        .replace("%country", "XX")
        .replace("%username", broadcast.md_author)
        .replace("%title", broadcast.md_title)
        .replace("%date", module_utils_1.formatDateTime(new Date(broadcast.date * module_utils_1.Time.MILLI)))
        .replace("%id", broadcast.vid.toString())
        .replace("%service", "vk")
        .replace(/%\w+/, "")).replace(/[^\x20-\xFF]/g, "");
}
exports.CreateFilename = CreateFilename;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3ZrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbW9kdWxlcy9tb2R1bGVfdmsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBK0M7QUFFL0MsNkNBQWtDO0FBQ2xDLGlEQUFvRTtBQUlwRSxzQkFBNkIsR0FBVztJQUN2QyxPQUFPLG1CQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQztTQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFFWixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUE7UUFFeEQsSUFBSSxDQUFDLENBQUM7WUFBRSxNQUFNLGlCQUFpQixDQUFBO1FBRS9CLElBQUksSUFBSSxHQUFpQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBRXpDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUN0QixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFaRCxvQ0FZQztBQUVELDJCQUFrQyxRQUFnQixFQUFFLFNBQXVCO0lBRTFFLElBQUksU0FBUyxDQUFDLEdBQUcsSUFBSSxTQUFTLENBQUMsWUFBWSxFQUFFO1FBQzVDLE9BQU8scUJBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxZQUFZLEVBQUUsUUFBUSxHQUFHLE1BQU0sQ0FBQyxDQUFBO0tBQzNFO1NBQ0ksSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFO1FBQ3ZCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDdEMsZ0JBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLFFBQVEsR0FBRyxLQUFLLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUNsRixDQUFDLENBQUMsQ0FBQTtLQUNGO1NBQ0k7UUFDSixNQUFNLGVBQWUsQ0FBQTtLQUNyQjtBQUNGLENBQUM7QUFiRCw4Q0FhQztBQUVELHdCQUErQixTQUF1QjtJQUNyRCxPQUFPLDRCQUFhLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0I7U0FDbkQsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUM7U0FDekIsT0FBTyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDO1NBQ3pDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQztTQUNyQyxPQUFPLENBQUMsT0FBTyxFQUFFLDZCQUFjLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxtQkFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDdkUsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ3hDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDO1NBQ3pCLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3JELENBQUM7QUFURCx3Q0FTQyJ9