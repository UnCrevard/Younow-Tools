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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3J0bXBkdW1wLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbW9kdWxlcy9tb2R1bGVfcnRtcGR1bXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwQkFBeUI7QUFDekIsaURBQW1EO0FBQ25ELDZDQUFnRDtBQUdoRCxrQkFBeUIsR0FBVyxFQUFFLFFBQWdCO0lBRXJELEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUMsRUFFOUIsQ0FBQyxDQUFBO0lBQ0YsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUV0QyxJQUFJLE1BQU0sR0FBRyxDQUFDLFFBQVEsRUFBQyxXQUFXLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsSUFBSSxFQUFDLFFBQVEsQ0FBQyxDQUFBO1FBRXBFLElBQUksSUFBSSxHQUFHLHFCQUFLLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBRXBDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ3RCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNaLENBQUMsQ0FBQyxDQUFBO1FBSUYsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDdEIsa0JBQUssQ0FBQyxpQkFBaUIsSUFBSSxFQUFFLENBQUMsQ0FBQTtRQUMvQixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQ3ZCLGtCQUFLLENBQUMsa0JBQWtCLElBQUksRUFBRSxDQUFDLENBQUE7WUFDL0IsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUNuQixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRTtRQUU5QixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRTtRQUM5QixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxrQkFBSyxDQUFDLENBQUE7SUFDOUIsQ0FBQyxDQUFDLENBQUE7QUFDSCxDQUFDO0FBbkNELDRCQW1DQyJ9