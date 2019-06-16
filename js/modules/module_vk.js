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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3ZrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbW9kdWxlcy9tb2R1bGVfdmsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBK0M7QUFFL0MsNkNBQWtDO0FBQ2xDLGlEQUFvRTtBQUNwRSw4QkFBNkI7QUFJN0IsU0FBZ0IsWUFBWSxDQUFDLEdBQVc7SUFDdkMsT0FBTyxtQkFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUM7U0FDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBRVosSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO1FBRXhELElBQUksQ0FBQyxDQUFDO1lBQUUsTUFBTSxpQkFBaUIsQ0FBQTtRQUUvQixJQUFJLElBQUksR0FBaUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUV6QyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDdEIsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDO0FBWkQsb0NBWUM7QUFFRCxTQUFnQixpQkFBaUIsQ0FBQyxRQUFnQixFQUFFLFNBQXVCO0lBRTFFLElBQUksU0FBUyxDQUFDLEdBQUcsSUFBSSxTQUFTLENBQUMsWUFBWSxFQUFFO1FBQzVDLE9BQU8scUJBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxZQUFZLEVBQUUsUUFBUSxHQUFHLE1BQU0sQ0FBQyxDQUFBO0tBQzNFO1NBQ0ksSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFO1FBQ3ZCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDdEMsZ0JBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLFFBQVEsR0FBRyxLQUFLLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUNsRixDQUFDLENBQUMsQ0FBQTtLQUNGO1NBQ0k7UUFDSixNQUFNLGVBQWUsQ0FBQTtLQUNyQjtBQUNGLENBQUM7QUFiRCw4Q0FhQztBQUVELFNBQWdCLGNBQWMsQ0FBQyxTQUF1QjtJQUNyRCxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUMsNEJBQWEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGdCQUFnQjtTQUMzRixPQUFPLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQztTQUN4QixPQUFPLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUM7U0FDeEMsT0FBTyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDO1NBQ3BDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsNkJBQWMsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLG1CQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUN0RSxPQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDeEMsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUM7U0FDeEIsT0FBTyxDQUFDLE1BQU0sRUFBQyxTQUFTLENBQUMsWUFBWSxDQUFBLENBQUMsQ0FBQSxRQUFRLENBQUEsQ0FBQyxDQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUMzRCxDQUFDO0FBVEQsd0NBU0MifQ==