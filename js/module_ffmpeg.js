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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX2ZmbXBlZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL21vZHVsZV9mZm1wZWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxrQ0FBaUM7QUFFakMscUNBQW9DO0FBRXBDLHFEQUFvRDtBQUNwRCx5REFBMkM7QUFFM0MsTUFBTSxjQUFjLEdBQUMsNEJBQTRCLENBQUE7QUFFakQsNEJBQW1DLEdBQVU7SUFFNUMsUUFBTyxHQUFHLENBQUMsV0FBVyxFQUFFLEVBQ3hCO1FBQ0MsS0FBSyxLQUFLO1lBQ1YsT0FBTyxVQUFVLENBQUE7UUFFakIsS0FBSyxJQUFJO1lBQ1QsT0FBTyxRQUFRLENBQUE7UUFFZixLQUFLLEtBQUs7WUFDVixPQUFPLEtBQUssQ0FBQTtRQUVaO1lBQ0MsT0FBTyxJQUFJLENBQUE7S0FDWjtBQUNGLENBQUM7QUFoQkQsZ0RBZ0JDO0FBRUQsZ0JBQXVCLE9BQWMsRUFBQyxPQUFjLEVBQUMsT0FBYztJQUVsRSxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQSxFQUFFO1FBRTNCLElBQUksSUFBSSxHQUFDLENBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxPQUFPLEVBQUMsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRTFELElBQUksTUFBTSxHQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFDLElBQUksQ0FBQyxDQUFBO1FBRW5DLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUVsQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBQyxHQUFHLENBQUEsRUFBRTtZQUV0QixrQkFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ2YsQ0FBQyxDQUFDLENBQUE7UUFFRixNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBQyxJQUFJLENBQUEsRUFBRTtZQUV0QixPQUFPLENBQUMsSUFBSSxJQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ2pCLENBQUMsQ0FBQyxDQUFBO0lBQ0gsQ0FBQyxDQUFDLENBQUE7QUFDSCxDQUFDO0FBckJELHdCQXFCQztBQUVELFlBQW9CLFNBQVEsT0FBTyxDQUFDLFFBQVE7SUFJM0MsWUFBWSxPQUFjLEVBQUMsT0FBYztRQUV4QyxLQUFLLEVBQUUsQ0FBQTtRQUVQLElBQUksSUFBSSxHQUFDLEVBQUUsQ0FBQTtRQUVYLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDZixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ2xCLElBQUksR0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUMzQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRWxCLElBQUksQ0FBQyxNQUFNLEdBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUMsSUFBSSxDQUFDLENBQUE7UUFFcEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUV2QyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUMsR0FBRyxDQUFBLEVBQUU7WUFHM0IsZ0JBQUcsQ0FBQyxjQUFjLEVBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDckIsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUMsSUFBSSxDQUFBLEVBQUU7WUFFM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUMsSUFBSSxDQUFDLENBQUE7UUFDdkIsQ0FBQyxDQUFDLENBQUE7UUFHRixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFDLG1CQUFJLENBQUMsQ0FBQTtRQUNsQyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBQyxtQkFBSSxDQUFDLENBQUE7SUFDdEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFZLEVBQUMsUUFBUSxFQUFDLFFBQVE7UUFFcEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBQyxRQUFRLENBQUMsQ0FBQTtJQUN4QyxDQUFDO0lBRUQsTUFBTSxDQUFDLFFBQVE7UUFFZCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDaEMsQ0FBQztDQUNEO0FBN0NELHdCQTZDQyJ9