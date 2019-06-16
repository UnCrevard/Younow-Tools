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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX2hscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZHVsZXMvbW9kdWxlX2hscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDZDQUFzRDtBQUN0RCwwQ0FBeUM7QUFFekMsNkNBQXFDO0FBQ3JDLGlEQUFxQztBQU9yQyxTQUFTLFVBQVUsQ0FBQyxRQUFRLEVBQUUsWUFBb0IsRUFBRSxNQUFjO0lBQ2pFLE1BQU0sR0FBRyxNQUFNLEdBQUcsR0FBRyxDQUFBO0lBQ3JCLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUE7SUFVckMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUMsbUJBQUksQ0FBQyxDQUFBO0FBQy9ELENBQUM7QUFFRCxTQUFTLFdBQVcsQ0FBQyxNQUEwQixFQUFFLElBQVksRUFBRSxRQUFrQjtJQUNoRixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQTtBQUM3QixDQUFDO0FBRUQsU0FBUyxXQUFXLENBQUMsTUFBMEI7SUFDOUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxrQkFBSyxDQUFDLENBQUE7QUFDcEIsQ0FBQztBQVlELFNBQWdCLEdBQUcsQ0FBQyxXQUFtQixFQUFFLFFBQWdCLEVBQUUsWUFBb0IsRUFBRSxNQUFjLEVBQUUsTUFBZSxFQUFFLFFBQVE7SUFFekgsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLFFBQVE7UUFBRSxNQUFNLG9CQUFvQixDQUFBO0lBRXpELElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQTtJQUNuQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUE7SUFDaEIsSUFBSSxJQUFJLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMs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