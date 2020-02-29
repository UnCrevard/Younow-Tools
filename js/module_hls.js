"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
//# sourceMappingURL=module_hls.js.map