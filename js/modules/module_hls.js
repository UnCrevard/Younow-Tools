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
//# sourceMappingURL=module_hls.js.map