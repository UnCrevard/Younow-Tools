"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_log_1 = require("./module_log");
const module_ffmpeg_1 = require("./module_ffmpeg");
const module_www_1 = require("./module_www");
const module_utils_1 = require("./module_utils");
function downloadSegments(settings, url, video_filename, total_segment, bar, isLive) {
    let running = 0;
    let counter = 0;
    let ptr = 0;
    let buffers = [];
    let stream = new module_ffmpeg_1.VideoWriter("-", video_filename, settings.useFFMPEG, module_utils_1.noop);
    return new Promise(resolve => {
        function downloadSegment() {
            while (running < settings.parallelDownloads && counter < total_segment) {
                let segment = counter;
                running++;
                counter++;
                module_www_1.getURL(`${url}${segment}.ts`, null)
                    .catch(err => {
                    module_log_1.error(`segment ${segment} fail with ${err}`);
                    return null;
                })
                    .then(buffer => {
                    if (bar) {
                        bar.tick();
                    }
                    buffers[segment] = buffer;
                    if (segment == ptr) {
                        while (ptr in buffers) {
                            stream.write(buffers[ptr], null);
                            delete buffers[ptr];
                            ptr++;
                        }
                    }
                    running--;
                    if (counter < total_segment) {
                        downloadSegment();
                    }
                    else if (running == 0) {
                        if (isLive) {
                            resolve(stream);
                        }
                        else {
                            stream.close(err => {
                                module_log_1.debug("downloadSegment stream.close", err);
                                resolve(err);
                            });
                        }
                    }
                })
                    .catch(err => {
                    module_log_1.error(err);
                    return false;
                });
            }
        }
        downloadSegment();
    });
}
exports.downloadSegments = downloadSegments;
//# sourceMappingURL=module_hls_younow.js.map