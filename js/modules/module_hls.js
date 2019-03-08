"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_log_1 = require("./module_log");
const ffmpeg = require("./module_ffmpeg");
const module_www_1 = require("./module_www");
const module_utils_1 = require("./module_utils");
function openStream(filename, ffmpegParams, rotate) {
    rotate = rotate % 360;
    rotate = Math.floor(rotate / 45) * 45;
    return new ffmpeg.VideoWriter("-", filename, ffmpegParams, module_utils_1.noop);
}
function writeStream(stream, data, callback) {
    stream.write(data, callback);
}
function closeStream(stream) {
    stream.close(module_log_1.error);
}
function hls(playlistURL, filename, ffmpegParams, rotate, isLive, callback) {
    if (!playlistURL || !filename)
        throw "hls invalid params";
    let lastSegment = 0;
    let timer = 3000;
    let root = playlistURL.substr(0, playlistURL.lastIndexOf("/") + 1);
    let chunks = {};
    let cache = [];
    let stream = openStream(filename, ffmpegParams, rotate);
    let idle = 0;
    function downloadPlaylist() {
        module_www_1.getURL(playlistURL, "utf8")
            .then((playlist) => {
            let lines = playlist.split("\n");
            lines.forEach(line => {
                if (line) {
                    if (line.charAt(0) == "#") {
                        let m = line.match(/#(.+?):(.+)/);
                        if (m) {
                            let params = m[2];
                            switch (m[1]) {
                                case "EXT-X-MEDIA-SEQUENCE":
                                    if (params < lastSegment) {
                                    }
                                    lastSegment = params;
                                    break;
                                case "EXT-X-TARGETDURATION":
                                    if (params > 5) {
                                    }
                                    else {
                                    }
                                    break;
                                case "EXT-X-PROGRAM-DATE-TIME":
                                case "EXT-X-VERSION":
                                case "EXTINF":
                                case "EXT-X-DISCONTINUITY-SEQUENCE":
                                    break;
                                default:
                            }
                        }
                        else {
                            switch (line) {
                                case "#EXTM3U":
                                case "#EXT-X-INDEPENDENT-SEGMENTS":
                                    break;
                                default:
                            }
                        }
                    }
                    else {
                        if (line in chunks) {
                        }
                        else {
                            chunks[line] = true;
                            let url = root + line;
                            cache.push(url);
                        }
                    }
                }
            });
            if (cache.length) {
                idle = 0;
                let url = cache.shift();
                module_www_1.getURL(url, null)
                    .then((data) => {
                    writeStream(stream, data, err => {
                    });
                })
                    .catch(module_log_1.error)
                    .then(() => {
                    if (!isLive) {
                        downloadPlaylist();
                    }
                    else {
                        setTimeout(downloadPlaylist, timer / (cache.length + 1));
                    }
                });
            }
            else {
                idle++;
                if (idle > 30 || isLive == false) {
                    closeStream(stream);
                    callback(true);
                }
                else {
                    setTimeout(downloadPlaylist, timer);
                }
            }
        })
            .catch(err => {
            module_log_1.error(err);
            closeStream(stream);
            callback(false);
        });
    }
    downloadPlaylist();
}
exports.hls = hls;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX2hscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZHVsZXMvbW9kdWxlX2hscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDZDQUFzRDtBQUN0RCwwQ0FBeUM7QUFFekMsNkNBQXFDO0FBQ3JDLGlEQUFxQztBQU9yQyxvQkFBb0IsUUFBUSxFQUFFLFlBQW9CLEVBQUUsTUFBYztJQUNqRSxNQUFNLEdBQUcsTUFBTSxHQUFHLEdBQUcsQ0FBQTtJQUNyQixNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFBO0lBVXJDLE9BQU8sSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBQyxRQUFRLEVBQUUsWUFBWSxFQUFDLG1CQUFJLENBQUMsQ0FBQTtBQUMvRCxDQUFDO0FBRUQscUJBQXFCLE1BQTBCLEVBQUUsSUFBWSxFQUFFLFFBQWtCO0lBQ2hGLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0FBQzdCLENBQUM7QUFFRCxxQkFBcUIsTUFBMEI7SUFDOUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxrQkFBSyxDQUFDLENBQUE7QUFDcEIsQ0FBQztBQVlELGFBQW9CLFdBQW1CLEVBQUUsUUFBZ0IsRUFBRSxZQUFvQixFQUFFLE1BQWMsRUFBRSxNQUFlLEVBQUUsUUFBUTtJQUV6SCxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsUUFBUTtRQUFFLE1BQU0sb0JBQW9CLENBQUE7SUFFekQsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFBO0lBQ25CLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQTtJQUNoQixJQUFJLElBQUksR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO0lBQ2xFLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FB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