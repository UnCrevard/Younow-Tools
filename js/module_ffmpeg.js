"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _stream = require("stream");
const _cp = require("child_process");
const module_log_1 = require("./modules/module_log");
const module_utils_1 = require("./modules/module_utils");
const FFMPEG_DEFAULT = "-loglevel error -c copy -y";
function convertExtToFormat(ext) {
    switch (ext.toLowerCase()) {
        case "mkv":
            return "matroska";
        case "ts":
            return "mpegts";
        case "mp4":
            return "mp4";
        default:
            return null;
    }
}
exports.convertExtToFormat = convertExtToFormat;
function ffmpeg(inpfile, outfile, options) {
    return new Promise(resolve => {
        let args = ["-y", "-i", inpfile, ...options.split(" "), outfile];
        let ffmpeg = _cp.spawn("ffmpeg", args);
        ffmpeg.stderr.pipe(process.stdout);
        ffmpeg.on("error", err => {
            module_log_1.error(err);
            resolve(false);
        });
        ffmpeg.on("exit", code => {
            resolve(code == 0);
        });
    });
}
exports.ffmpeg = ffmpeg;
class FFMPEG extends _stream.Writable {
    constructor(inpfile, outfile) {
        super();
        let args = [];
        args.push("-i");
        args.push(inpfile);
        args = args.concat(FFMPEG_DEFAULT.split(" "));
        args.push(outfile);
        this.ffmpeg = _cp.spawn("ffmpeg", args);
        this.ffmpeg.stderr.pipe(process.stdout);
        this.ffmpeg.on("error", err => {
            module_log_1.log("ffmpeg.error", err.message);
            this.emit("exit", -1);
        });
        this.ffmpeg.on("exit", code => {
            this.emit("exit", code);
        });
        this.ffmpeg.stdin.on("error", module_utils_1.noop);
        this.on("error", module_utils_1.noop);
    }
    _write(chunk, encoding, callback) {
        this.ffmpeg.stdin.write(chunk, callback);
    }
    _final(callback) {
        this.ffmpeg.stdin.end(callback);
    }
}
exports.FFMPEG = FFMPEG;
//# sourceMappingURL=module_ffmpeg.js.map