"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_log_1 = require("./modules/module_log");
const module_ffmpeg_1 = require("./modules/module_ffmpeg");
const module_www_1 = require("./modules/module_www");
function downloadSegments(settings, url, video_filename, total_segment, bar, isLive) {
    let running = 0;
    let counter = 0;
    let ptr = 0;
    let buffers = [];
    let stream = new module_ffmpeg_1.VideoWriter(video_filename, settings.useFFMPEG);
    return new Promise(resolve => {
        function downloadSegment() {
            while (running < settings.parallelDownloads && counter < total_segment) {
                let segment = counter;
                running++;
                counter++;
                module_www_1.getURL(`${url}${segment}.ts`, null)
                    .catch(err => {
                    module_log_1.error(`segment ${segment} fail with ${err}`);
                    return null;
                })
                    .then(buffer => {
                    if (bar) {
                        bar.tick();
                    }
                    buffers[segment] = buffer;
                    if (segment == ptr) {
                        while (ptr in buffers) {
                            stream.write(buffers[ptr], null);
                            delete buffers[ptr];
                            ptr++;
                        }
                    }
                    running--;
                    if (counter < total_segment) {
                        downloadSegment();
                    }
                    else if (running == 0) {
                        if (isLive) {
                            resolve(stream);
                        }
                        else {
                            stream.close(err => {
                                resolve(err);
                            });
                        }
                    }
                })
                    .catch(err => {
                    module_log_1.error(err);
                    return false;
                });
            }
        }
        downloadSegment();
    });
}
exports.downloadSegments = downloadSegments;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX2hsc195b3Vub3cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9tb2R1bGVfaGxzX3lvdW5vdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHFEQUF1RDtBQUN2RCwyREFBcUQ7QUFDckQscURBQTZDO0FBUzdDLDBCQUFpQyxRQUFrQixFQUFFLEdBQVcsRUFDL0QsY0FBc0IsRUFDdEIsYUFBcUIsRUFDckIsR0FBb0IsRUFDcEIsTUFBZTtJQUNmLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQTtJQUNmLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQTtJQUNmLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQTtJQUNYLElBQUksT0FBTyxHQUFrQixFQUFFLENBQUE7SUFDL0IsSUFBSSxNQUFNLEdBQUcsSUFBSSwyQkFBVyxDQUFDLGNBQWMsRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7SUFFaEUsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUM1QjtZQUNDLE9BQU8sT0FBTyxHQUFHLFFBQVEsQ0FBQyxpQkFBaUIsSUFBSSxPQUFPLEdBQUcsYUFBYSxFQUFFO2dCQUN2RSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUE7Z0JBRXJCLE9BQU8sRUFBRSxDQUFBO2dCQUNULE9BQU8sRUFBRSxDQUFBO2dCQUVULG1CQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsT0FBTyxLQUFLLEVBQUUsSUFBSSxDQUFDO3FCQUNqQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBRVosa0JBQUssQ0FBQyxXQUFXLE9BQU8sY0FBYyxHQUFHLEVBQUUsQ0FBQyxDQUFBO29CQUM1QyxPQUFPLElBQUksQ0FBQTtnQkFDWixDQUFDLENBQUM7cUJBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUNkLElBQUksR0FBRyxFQUFFO3dCQUNSLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtxQkFDVjtvQkFFRCxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsTUFBTSxDQUFBO29CQUV6QixJQUFJLE9BQU8sSUFBSSxHQUFHLEVBQUU7d0JBQ25CLE9BQU8sR0FBRyxJQUFJLE9BQU8sRUFBRTs0QkFDdEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUE7NEJBQ2hDLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBOzRCQUNuQixHQUFHLEVBQUUsQ0FBQTt5QkFDTDtxQkFDRDtvQkFFRCxPQUFPLEVBQUUsQ0FBQTtvQkFFVCxJQUFJLE9BQU8sR0FBRyxhQUFhLEVBQUU7d0JBQzVCLGVBQWUsRUFBRSxDQUFBO3FCQUNqQjt5QkFDSSxJQUFJLE9BQU8sSUFBSSxDQUFDLEVBQUU7d0JBQ3RCLElBQUksTUFBTSxFQUFFOzRCQUNYLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTt5QkFDZjs2QkFDSTs0QkFDSixNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dDQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7NEJBQ2IsQ0FBQyxDQUFDLENBQUE7eUJBQ0Y7cUJBQ0Q7Z0JBQ0YsQ0FBQyxDQUFDO3FCQUNELEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDWixrQkFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO29CQUNWLE9BQU8sS0FBSyxDQUFBO2dCQUNiLENBQUMsQ0FBQyxDQUFBO2FBQ0g7UUFDRixDQUFDO1FBRUQsZUFBZSxFQUFFLENBQUE7SUFDbEIsQ0FBQyxDQUFDLENBQUE7QUFDSCxDQUFDO0FBakVELDRDQWlFQyJ9