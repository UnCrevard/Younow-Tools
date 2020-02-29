"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _fs = require("fs");
const child_process_1 = require("child_process");
const module_log_1 = require("./module_log");
function rtmpdump(url, filename) {
    _fs.createWriteStream(filename, {});
    return new Promise((resolve, reject) => {
        let params = ["--live", "--timeout", "120", "--rtmp", url, "-o", filename];
        let proc = child_process_1.spawn("rtmpdump", params);
        proc.on("error", err => {
            reject(err);
        });
        proc.on("exit", code => {
            module_log_1.debug(`rtmpdump exit ${code}`);
        });
        proc.on("close", code => {
            module_log_1.debug(`rtmpdump close ${code}`);
            resolve(code == 0);
        });
        proc.stdout.on("data", data => {
        });
        proc.stderr.on("data", data => {
        });
        proc.stdin.on("error", module_log_1.error);
    });
}
exports.rtmpdump = rtmpdump;
//# sourceMappingURL=module_rtmpdump.js.map