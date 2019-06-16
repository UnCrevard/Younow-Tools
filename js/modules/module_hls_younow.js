"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_log_1 = require("./module_log");
const module_ffmpeg_1 = require("./module_ffmpeg");
const module_www_1 = require("./module_www");
const module_utils_1 = require("./module_utils");
function downloadSegments(settings, url, video_filename, total_segment, bar, isLive) {
    let running = 0;
    let counter = 0;
    let ptr = 0;
    let buffers = [];
    let stream = new module_ffmpeg_1.VideoWriter("-", video_filename, settings.useFFMPEG, module_utils_1.noop);
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
                                module_log_1.debug("downloadSegment stream.close", err);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX2hsc195b3Vub3cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9tb2R1bGVzL21vZHVsZV9obHNfeW91bm93LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsNkNBQXNEO0FBQ3RELG1EQUE2QztBQUM3Qyw2Q0FBcUM7QUFDckMsaURBQXFDO0FBU3JDLFNBQWdCLGdCQUFnQixDQUFDLFFBQWtCLEVBQUUsR0FBVyxFQUMvRCxjQUFzQixFQUN0QixhQUFxQixFQUNyQixHQUFvQixFQUNwQixNQUFlO0lBQ2YsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFBO0lBQ2YsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFBO0lBQ2YsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFBO0lBQ1gsSUFBSSxPQUFPLEdBQWtCLEVBQUUsQ0FBQTtJQUMvQixJQUFJLE1BQU0sR0FBRyxJQUFJLDJCQUFXLENBQUMsR0FBRyxFQUFDLGNBQWMsRUFBRSxRQUFRLENBQUMsU0FBUyxFQUFDLG1CQUFJLENBQUMsQ0FBQTtJQUV6RSxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQzVCLFNBQVMsZUFBZTtZQUN2QixPQUFPLE9BQU8sR0FBRyxRQUFRLENBQUMsaUJBQWlCLElBQUksT0FBTyxHQUFHLGFBQWEsRUFBRTtnQkFDdkUsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFBO2dCQUVyQixPQUFPLEVBQUUsQ0FBQTtnQkFDVCxPQUFPLEVBQUUsQ0FBQTtnQkFFVCxtQkFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLE9BQU8sS0FBSyxFQUFFLElBQUksQ0FBQztxQkFDakMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUVaLGtCQUFLLENBQUMsV0FBVyxPQUFPLGNBQWMsR0FBRyxFQUFFLENBQUMsQ0FBQTtvQkFDNUMsT0FBTyxJQUFJLENBQUE7Z0JBQ1osQ0FBQyxDQUFDO3FCQUNELElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtvQkFDZCxJQUFJLEdBQUcsRUFBRTt3QkFDUixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUE7cUJBQ1Y7b0JBRUQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLE1BQU0sQ0FBQTtvQkFFekIsSUFBSSxPQUFPLElBQUksR0FBRyxFQUFFO3dCQUNuQixPQUFPLEdBQUcsSUFBSSxPQUFPLEVBQUU7NEJBQ3RCLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBOzRCQUNoQyxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTs0QkFDbkIsR0FBRyxFQUFFLENBQUE7eUJBQ0w7cUJBQ0Q7b0JBRUQsT0FBTyxFQUFFLENBQUE7b0JBRVQsSUFBSSxPQUFPLEdBQUcsYUFBYSxFQUFFO3dCQUM1QixlQUFlLEVBQUUsQ0FBQTtxQkFDakI7eUJBQ0ksSUFBSSxPQUFPLElBQUksQ0FBQyxFQUFFO3dCQUN0QixJQUFJLE1BQU0sRUFBRTs0QkFDWCxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7eUJBQ2Y7NkJBQ0k7NEJBQ0osTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtnQ0FFbEIsa0JBQUssQ0FBQyw4QkFBOEIsRUFBQyxHQUFHLENBQUMsQ0FBQTtnQ0FFekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBOzRCQUNiLENBQUMsQ0FBQyxDQUFBO3lCQUNGO3FCQUNEO2dCQUNGLENBQUMsQ0FBQztxQkFDRCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ1osa0JBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtvQkFDVixPQUFPLEtBQUssQ0FBQTtnQkFDYixDQUFDLENBQUMsQ0FBQTthQUNIO1FBQ0YsQ0FBQztRQUVELGVBQWUsRUFBRSxDQUFBO0lBQ2xCLENBQUMsQ0FBQyxDQUFBO0FBQ0gsQ0FBQztBQXBFRCw0Q0FvRUMifQ==