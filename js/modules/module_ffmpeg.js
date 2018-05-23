"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const child_process_1 = require("child_process");
const module_log_1 = require("./module_log");
class VideoWriter {
    constructor(filename, useFFMPEG) {
        this.stream = null;
        this.ffmpeg = null;
        this.filename = null;
        this.filename = filename;
        if (useFFMPEG) {
            let params = `-i - ${useFFMPEG} ${filename}`.split(" ");
            module_log_1.info(`FFMPEG : ${params.join(" ")}`);
            this.ffmpeg = child_process_1.spawn("ffmpeg", params);
            this.ffmpeg.on("error", err => {
                module_log_1.error(err);
            });
            this.ffmpeg.on("exit", code => {
                if (code) {
                    module_log_1.error(`FFMPEG exit ${code}`);
                }
            });
            this.ffmpeg.on("close", code => {
                this.ffmpeg = null;
            });
            this.ffmpeg.stderr.on("data", data => {
            });
            this.ffmpeg.stdin.on("error", err => err);
        }
        else {
            this.stream = fs.createWriteStream(filename);
        }
    }
    close(callback) {
        if (this.ffmpeg) {
            this.ffmpeg.stdin.end(callback);
        }
        else if (this.stream) {
            this.stream.end(callback);
        }
    }
    write(data, callback) {
        if (this.ffmpeg && data) {
            this.ffmpeg.stdin.write(data, callback);
        }
        else if (this.stream && data) {
            this.stream.write(data, callback);
        }
    }
}
exports.VideoWriter = VideoWriter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX2ZmbXBlZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZHVsZXMvbW9kdWxlX2ZmbXBlZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlCQUF3QjtBQUN4QixpREFBZ0Q7QUFDaEQsNkNBQTJDO0FBTTNDO0lBVUMsWUFBYSxRQUFlLEVBQUMsU0FBZ0I7UUFSckMsV0FBTSxHQUFnQixJQUFJLENBQUE7UUFDMUIsV0FBTSxHQUFjLElBQUksQ0FBQTtRQUN4QixhQUFRLEdBQVEsSUFBSSxDQUFBO1FBUTNCLElBQUksQ0FBQyxRQUFRLEdBQUMsUUFBUSxDQUFBO1FBRXRCLElBQUksU0FBUyxFQUNiO1lBQ0MsSUFBSSxNQUFNLEdBQUMsUUFBUSxTQUFTLElBQUksUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBRXJELGlCQUFJLENBQUMsWUFBWSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUVwQyxJQUFJLENBQUMsTUFBTSxHQUFDLHFCQUFLLENBQUMsUUFBUSxFQUFDLE1BQU0sQ0FBQyxDQUFBO1lBRWxDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBQyxHQUFHLENBQUEsRUFBRTtnQkFFM0Isa0JBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUNYLENBQUMsQ0FBQyxDQUFBO1lBRUYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFDLElBQUksQ0FBQSxFQUFFO2dCQUUzQixJQUFJLElBQUksRUFDUjtvQkFDQyxrQkFBSyxDQUFDLGVBQWUsSUFBSSxFQUFFLENBQUMsQ0FBQTtpQkFDNUI7WUFDRixDQUFDLENBQUMsQ0FBQTtZQUVGLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBQyxJQUFJLENBQUEsRUFBRTtnQkFFNUIsSUFBSSxDQUFDLE1BQU0sR0FBQyxJQUFJLENBQUE7WUFDakIsQ0FBQyxDQUFDLENBQUE7WUFFRixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFDLElBQUksQ0FBQSxFQUFFO1lBR25DLENBQUMsQ0FBQyxDQUFBO1lBRUYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBQyxHQUFHLENBQUEsRUFBRSxDQUFBLEdBQUcsQ0FBQyxDQUFBO1NBQ3RDO2FBRUQ7WUFDQyxJQUFJLENBQUMsTUFBTSxHQUFDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQTtTQUMxQztJQUNGLENBQUM7SUFLRCxLQUFLLENBQUMsUUFBaUI7UUFFdEIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUNmO1lBQ0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1NBQy9CO2FBQ0ksSUFBSSxJQUFJLENBQUMsTUFBTSxFQUNwQjtZQUNDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1NBQ3pCO0lBQ0YsQ0FBQztJQU1ELEtBQUssQ0FBQyxJQUFXLEVBQUMsUUFBaUI7UUFFbEMsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksRUFDdkI7WUFDQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFDLFFBQVEsQ0FBQyxDQUFBO1NBQ3RDO2FBQ0ksSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksRUFDNUI7WUFDQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUMsUUFBUSxDQUFDLENBQUE7U0FDaEM7SUFDRixDQUFDO0NBQ0Q7QUFuRkQsa0NBbUZDIn0=