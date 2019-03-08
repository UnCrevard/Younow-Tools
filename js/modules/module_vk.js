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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3ZrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbW9kdWxlcy9tb2R1bGVfdmsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBK0M7QUFFL0MsNkNBQWtDO0FBQ2xDLGlEQUFvRTtBQUNwRSw4QkFBNkI7QUFJN0Isc0JBQTZCLEdBQVc7SUFDdkMsT0FBTyxtQkFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUM7U0FDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBRVosSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO1FBRXhELElBQUksQ0FBQyxDQUFDO1lBQUUsTUFBTSxpQkFBaUIsQ0FBQTtRQUUvQixJQUFJLElBQUksR0FBaUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUV6QyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDdEIsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDO0FBWkQsb0NBWUM7QUFFRCwyQkFBa0MsUUFBZ0IsRUFBRSxTQUF1QjtJQUUxRSxJQUFJLFNBQVMsQ0FBQyxHQUFHLElBQUksU0FBUyxDQUFDLFlBQVksRUFBRTtRQUM1QyxPQUFPLHFCQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxTQUFTLENBQUMsWUFBWSxFQUFFLFFBQVEsR0FBRyxNQUFNLENBQUMsQ0FBQTtLQUMzRTtTQUNJLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRTtRQUN2QixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3RDLGdCQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxRQUFRLEdBQUcsS0FBSyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDbEYsQ0FBQyxDQUFDLENBQUE7S0FDRjtTQUNJO1FBQ0osTUFBTSxlQUFlLENBQUE7S0FDckI7QUFDRixDQUFDO0FBYkQsOENBYUM7QUFFRCx3QkFBK0IsU0FBdUI7SUFDckQsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFDLDRCQUFhLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0I7U0FDM0YsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUM7U0FDeEIsT0FBTyxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDO1NBQ3hDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQztTQUNwQyxPQUFPLENBQUMsTUFBTSxFQUFFLDZCQUFjLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxtQkFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDdEUsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ3hDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDO1NBQ3hCLE9BQU8sQ0FBQyxNQUFNLEVBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQSxDQUFDLENBQUEsUUFBUSxDQUFBLENBQUMsQ0FBQSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDM0QsQ0FBQztBQVRELHdDQVNDIn0=