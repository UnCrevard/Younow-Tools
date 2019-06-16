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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX2ZmbXBlZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZHVsZXMvbW9kdWxlX2ZmbXBlZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGlEQUFtRDtBQUNuRCw2Q0FBc0Q7QUFDdEQsaURBQW1DO0FBRW5DLE1BQWEsV0FBVztJQU12QixZQUFZLE1BQWEsRUFBQyxRQUFnQixFQUFFLFNBQWlCLEVBQUMsUUFBK0I7UUFKckYsV0FBTSxHQUFtQixJQUFJLENBQUE7UUFDN0IsV0FBTSxHQUFpQixJQUFJLENBQUE7UUFDM0IsYUFBUSxHQUFXLElBQUksQ0FBQTtRQUk5QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtRQUl4QixJQUFJLE1BQU0sR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBRXhELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7UUFFckIsaUJBQUksQ0FBQyxZQUFZLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBRXBDLElBQUksQ0FBQyxNQUFNLEdBQUcscUJBQUssQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUE7UUFFckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQzdCLGtCQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDVixRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDaEIsQ0FBQyxDQUFDLENBQUE7UUFJRixJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDN0IsaUJBQUksQ0FBQyxlQUFlLElBQUksRUFBRSxDQUFDLENBQUE7UUFDNUIsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDOUIsaUJBQUksQ0FBQyxnQkFBZ0IsSUFBSSxFQUFFLENBQUMsQ0FBQTtZQUM1QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtZQUNsQixRQUFRLENBQUMsSUFBSSxLQUFHLENBQUMsQ0FBQyxDQUFBO1FBQ25CLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxtQkFBSSxDQUFDLENBQUE7UUFFbkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxtQkFBSSxDQUFDLENBQUE7SUFDcEMsQ0FBQztJQUVELEtBQUssQ0FBQyxRQUFrQjtRQUN2QixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDaEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUE7U0FDdkI7SUFDRixDQUFDO0lBRUQsS0FBSyxDQUFDLElBQVksRUFBRSxRQUFrQjtRQUNyQyxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUM3QjtJQUNGLENBQUM7Q0FDRDtBQXJERCxrQ0FxREMifQ==