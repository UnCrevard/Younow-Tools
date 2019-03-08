"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const module_www_1 = require("./modules/module_www");
const module_log_1 = require("./modules/module_log");
const _cp = require("child_process");
let currentConnections = 0;
function HLS(url, outfile, timeout, maxParallelDownload) {
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        let theEnd = false;
        function parsePlaylist(playlist, head, tail) {
            if (!playlist)
                throw "playlist empty";
            let lines = playlist.split("\n");
            if (lines.shift() != "#EXTM3U")
                throw "playlist invalid";
            let segments = [];
            for (let line of lines) {
                if (line.length) {
                    if (line.startsWith("#")) {
                        let m = line.match(/#(EXT-X-|EXT)([A-Z0-9-]+)(?::(.*))?/);
                        if (!m) {
                            module_log_1.debug("error", line);
                        }
                        else {
                            switch (m[2]) {
                                case "ENDLIST":
                                    theEnd = true;
                                    break;
                                case "M3U":
                                case "INF":
                                case "VERSION":
                                case "MEDIA-SEQUENCE":
                                case "TARGETDURATION":
                                case "PROGRAM-DATE-TIME":
                                case "INDEPENDENT-SEGMENTS":
                                case "START":
                                case "DISCONTINUITY-SEQUENCE":
                                case "DISCONTINUITY":
                                    break;
                                case "DYNAMICALLY-GENERATED":
                                    throw "EXT-X-DYNAMICALLY-GENERATED";
                                default:
                                    module_log_1.debug("not supported", line);
                            }
                        }
                    }
                    else {
                        if (line.match(/.+:\/\/.+/)) {
                            segments.push(line);
                        }
                        else {
                            segments.push(head + "/" + line + tail);
                        }
                    }
                }
            }
            if (segments.length == 0)
                throw "playlist invalid";
            return segments;
        }
        let countSegment = 0;
        let segmentSeen = {};
        let cache = [];
        let idle = 0;
        let player = false;
        if (!url)
            throw "url is null";
        let m3u8 = url.match(/(.+)\/.+\.m3u8(.+|)/i);
        if (!m3u8)
            throw "playlist url is invalid";
        let args = [];
        args.push("-loglevel");
        args.push("error");
        args.push("-i");
        args.push("-");
        args.push("-c");
        args.push("copy");
        args.push(outfile);
        let ffmpeg = _cp.spawn("ffmpeg", args);
        ffmpeg.on("error", err => {
            module_log_1.error("ffmpeg.error", err.message);
            resolve(false);
        });
        ffmpeg.on("exit", code => {
            module_log_1.info("ffmpeg.exit", code);
            resolve(code === 0);
        });
        ffmpeg.stderr.pipe(process.stdout);
        ffmpeg.stdin.on("error", module_log_1.error);
        while (true) {
            try {
                let text = yield module_www_1.getURL(url, "utf-8");
                let segments = parsePlaylist(text, m3u8[1], m3u8[2]);
                for (let segment of segments) {
                    if (!(segment in segmentSeen)) {
                        segmentSeen[segment] = true;
                        cache.push(segment);
                    }
                }
                countSegment += cache.length;
                module_log_1.debug("segments", cache.length);
                while (cache.length) {
                    idle = 0;
                    let len = Math.min(cache.length, currentConnections < 50 ? maxParallelDownload : 1);
                    let promises = cache.splice(0, len).map(url => {
                        return module_www_1.getURL(url, null).catch(err => {
                            module_log_1.error(err);
                            return null;
                        });
                    });
                    currentConnections += promises.length;
                    let buffers = yield Promise.all(promises);
                    currentConnections -= promises.length;
                    if (!ffmpeg.stdin.writable)
                        throw "stream closed";
                    for (let buffer of buffers) {
                        if (buffer)
                            ffmpeg.stdin.write(buffer);
                    }
                }
            }
            catch (err) {
                module_log_1.error("HLS crash", err);
            }
            if (ffmpeg.stdin.writable)
                ffmpeg.stdin.end();
            return;
        }
    }));
}
exports.HLS = HLS;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX2hscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL21vZHVsZV9obHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLHFEQUE2QztBQUM3QyxxREFBNkQ7QUFJN0QscUNBQW9DO0FBRXBDLElBQUksa0JBQWtCLEdBQUcsQ0FBQyxDQUFBO0FBTTFCLGFBQW9CLEdBQVcsRUFDOUIsT0FBZSxFQUNmLE9BQWUsRUFDZixtQkFBMkI7SUFFM0IsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFNLE9BQU8sRUFBQyxFQUFFO1FBRWxDLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQTtRQUVsQix1QkFBdUIsUUFBZ0IsRUFBRSxJQUFZLEVBQUUsSUFBWTtZQUVsRSxJQUFJLENBQUMsUUFBUTtnQkFBRSxNQUFNLGdCQUFnQixDQUFBO1lBRXJDLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7WUFFaEMsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksU0FBUztnQkFBRSxNQUFNLGtCQUFrQixDQUFBO1lBRXhELElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQTtZQUVqQixLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTtnQkFFdkIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO29CQUNoQixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7d0JBRXpCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQTt3QkFFekQsSUFBSSxDQUFDLENBQUMsRUFBRTs0QkFDUCxrQkFBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQTt5QkFDcEI7NkJBQ0k7NEJBQ0osUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0NBRWIsS0FBSyxTQUFTO29DQUNiLE1BQU0sR0FBRyxJQUFJLENBQUM7b0NBQ2QsTUFBTTtnQ0FDUCxL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