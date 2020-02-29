"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const module_log_1 = require("./module_log");
const module_utils_1 = require("./module_utils");
class VideoWriter {
    constructor(source, filename, useFFMPEG, callback) {
        this.stream = null;
        this.ffmpeg = null;
        this.filename = null;
        this.filename = filename;
        let params = ["-i", source].concat(useFFMPEG.split(" "));
        params.push(filename);
        module_log_1.info(`FFMPEG : ${params.join(" ")}`);
        this.ffmpeg = child_process_1.spawn("ffmpeg", params);
        this.ffmpeg.on("error", err => {
            module_log_1.error(err);
            callback(false);
        });
        this.ffmpeg.on("exit", code => {
            module_log_1.info(`FFMPEG exit ${code}`);
        });
        this.ffmpeg.on("close", code => {
            module_log_1.info(`FFMPEG close ${code}`);
            this.ffmpeg = null;
            callback(code === 0);
        });
        this.ffmpeg.stderr.on("data", module_utils_1.noop);
        this.ffmpeg.stdin.on("error", module_utils_1.noop);
    }
    close(callback) {
        if (this.ffmpeg) {
            this.ffmpeg.stdin.end();
        }
    }
    write(data, callback) {
        if (this.ffmpeg && data) {
            this.ffmpeg.stdin.write(data);
        }
    }
}
exports.VideoWriter = VideoWriter;
//# sourceMappingURL=module_ffmpeg.js.map