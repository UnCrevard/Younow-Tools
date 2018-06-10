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
            let params = ["-i", "-"].concat(useFFMPEG.split(" "));
            params.push(filename);
            module_log_1.info(`FFMPEG : ${params.join(" ")}`);
            this.ffmpeg = child_process_1.spawn("ffmpeg", params);
            this.ffmpeg.on("error", err => {
                module_log_1.error(err);
            });
            this.ffmpeg.on("exit", code => {
                module_log_1.info(`FFMPEG exit ${code}`);
            });
            this.ffmpeg.on("close", code => {
                module_log_1.info(`FFMPEG close ${code}`);
                this.ffmpeg = null;
            });
            this.ffmpeg.stderr.on("data", data => {
                module_log_1.error(data.toString());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX2ZmbXBlZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZHVsZXMvbW9kdWxlX2ZmbXBlZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlCQUF3QjtBQUN4QixpREFBbUQ7QUFDbkQsNkNBQXNEO0FBTXREO0lBU0MsWUFBWSxRQUFnQixFQUFFLFNBQWlCO1FBUnZDLFdBQU0sR0FBbUIsSUFBSSxDQUFBO1FBQzdCLFdBQU0sR0FBaUIsSUFBSSxDQUFBO1FBQzNCLGFBQVEsR0FBVyxJQUFJLENBQUE7UUFPOUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7UUFFeEIsSUFBSSxTQUFTLEVBQUU7WUFJZCxJQUFJLE1BQU0sR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1lBRXJELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7WUFFckIsaUJBQUksQ0FBQyxZQUFZLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBRXBDLElBQUksQ0FBQyxNQUFNLEdBQUcscUJBQUssQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUE7WUFFckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFFO2dCQUM3QixrQkFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ1gsQ0FBQyxDQUFDLENBQUE7WUFJRixJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUU7Z0JBQzdCLGlCQUFJLENBQUMsZUFBZSxJQUFJLEVBQUUsQ0FBQyxDQUFBO1lBQzVCLENBQUMsQ0FBQyxDQUFBO1lBRUYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUM5QixpQkFBSSxDQUFDLGdCQUFnQixJQUFJLEVBQUUsQ0FBQyxDQUFBO2dCQUM1QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtZQUNuQixDQUFDLENBQUMsQ0FBQTtZQUVGLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUU7Z0JBQ3BDLGtCQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFDdkIsQ0FBQyxDQUFDLENBQUE7WUFFRixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUE7U0FDekM7YUFDSTtZQUNKLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFBO1NBQzVDO0lBQ0YsQ0FBQztJQUtELEtBQUssQ0FBQyxRQUFrQjtRQUN2QixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDaEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1NBQy9CO2FBQ0ksSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1NBQ3pCO0lBQ0YsQ0FBQztJQU1ELEtBQUssQ0FBQyxJQUFZLEVBQUUsUUFBa0I7UUFDckMsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRTtZQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFBO1NBQ3ZDO2FBQ0ksSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRTtZQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUE7U0FDakM7SUFDRixDQUFDO0NBQ0Q7QUExRUQsa0NBMEVDIn0=