"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_log_1 = require("./module_log");
const ffmpeg = require("./module_ffmpeg");
const module_www_1 = require("./module_www");
function openStream(filename, ffmpegParams, rotate) {
    rotate = rotate % 360;
    rotate = Math.floor(rotate / 45) * 45;
    return new ffmpeg.VideoWriter(filename, ffmpegParams);
}
function writeStream(stream, data, callback) {
    stream.write(data, callback);
}
function closeStream(stream) {
    stream.close(module_log_1.error);
}
function hls(playlistURL, filename, ffmpegParams, rotate, isLive, callback) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX2hscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZHVsZXMvbW9kdWxlX2hscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDZDQUFzRDtBQUN0RCwwQ0FBeUM7QUFFekMsNkNBQXFDO0FBT3JDLG9CQUFvQixRQUFRLEVBQUUsWUFBb0IsRUFBRSxNQUFjO0lBQ2pFLE1BQU0sR0FBRyxNQUFNLEdBQUcsR0FBRyxDQUFBO0lBQ3JCLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUE7SUFVckMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFBO0FBQ3RELENBQUM7QUFFRCxxQkFBcUIsTUFBMEIsRUFBRSxJQUFZLEVBQUUsUUFBa0I7SUFDaEYsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUE7QUFDN0IsQ0FBQztBQUVELHFCQUFxQixNQUEwQjtJQUM5QyxNQUFNLENBQUMsS0FBSyxDQUFDLGtCQUFLLENBQUMsQ0FBQTtBQUNwQixDQUFDO0FBWUQsYUFBb0IsV0FBbUIsRUFBRSxRQUFnQixFQUFFLFlBQW9CLEVBQUUsTUFBYyxFQUFFLE1BQWUsRUFBRSxRQUFRO0lBQ3pILElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQTtJQUNuQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUE7SUFDaEIsSUFBSSxJQUFJLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUNsRSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUE7SUFDZixJQUFJLEtBQUssR0FBRyxFQUFFLENBQUE7SUFDZCxJQUFJLE1BQU0sR0FBRyxVQUFVLENBQUMsUUFBUSxFQUFFLFlBQVksRUFBRSxNQUFNLENBQUMs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