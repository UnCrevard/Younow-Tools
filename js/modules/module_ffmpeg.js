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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX2ZmbXBlZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZHVsZXMvbW9kdWxlX2ZmbXBlZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGlEQUFtRDtBQUNuRCw2Q0FBc0Q7QUFDdEQsaURBQW1DO0FBRW5DO0lBTUMsWUFBWSxNQUFhLEVBQUMsUUFBZ0IsRUFBRSxTQUFpQixFQUFDLFFBQStCO1FBSnJGLFdBQU0sR0FBbUIsSUFBSSxDQUFBO1FBQzdCLFdBQU0sR0FBaUIsSUFBSSxDQUFBO1FBQzNCLGFBQVEsR0FBVyxJQUFJLENBQUE7UUFJOUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7UUFJeEIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUV4RCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBRXJCLGlCQUFJLENBQUMsWUFBWSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUVwQyxJQUFJLENBQUMsTUFBTSxHQUFHLHFCQUFLLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBRXJDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsRUFBRTtZQUM3QixrQkFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ1YsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ2hCLENBQUMsQ0FBQyxDQUFBO1FBSUYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQzdCLGlCQUFJLENBQUMsZUFBZSxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBQzVCLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQzlCLGlCQUFJLENBQUMsZ0JBQWdCLElBQUksRUFBRSxDQUFDLENBQUE7WUFDNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUE7WUFDbEIsUUFBUSxDQUFDLElBQUksS0FBRyxDQUFDLENBQUMsQ0FBQTtRQUNuQixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsbUJBQUksQ0FBQyxDQUFBO1FBRW5DLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsbUJBQUksQ0FBQyxDQUFBO0lBQ3BDLENBQUM7SUFFRCxLQUFLLENBQUMsUUFBa0I7UUFDdkIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFBO1NBQ3ZCO0lBQ0YsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFZLEVBQUUsUUFBa0I7UUFDckMsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRTtZQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7U0FDN0I7SUFDRixDQUFDO0NBQ0Q7QUFyREQsa0NBcURDIn0=