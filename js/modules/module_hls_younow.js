"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_log_1 = require("./module_log");
const module_ffmpeg_1 = require("./module_ffmpeg");
const module_www_1 = require("./module_www");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX2hsc195b3Vub3cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9tb2R1bGVzL21vZHVsZV9obHNfeW91bm93LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsNkNBQStDO0FBQy9DLG1EQUE2QztBQUM3Qyw2Q0FBcUM7QUFTckMsMEJBQWlDLFFBQWtCLEVBQUUsR0FBVyxFQUMvRCxjQUFzQixFQUN0QixhQUFxQixFQUNyQixHQUFvQixFQUNwQixNQUFlO0lBQ2YsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFBO0lBQ2YsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFBO0lBQ2YsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFBO0lBQ1gsSUFBSSxPQUFPLEdBQWtCLEVBQUUsQ0FBQTtJQUMvQixJQUFJLE1BQU0sR0FBRyxJQUFJLDJCQUFXLENBQUMsY0FBYyxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUVoRSxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQzVCO1lBQ0MsT0FBTyxPQUFPLEdBQUcsUUFBUSxDQUFDLGlCQUFpQixJQUFJLE9BQU8sR0FBRyxhQUFhLEVBQUU7Z0JBQ3ZFLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQTtnQkFFckIsT0FBTyxFQUFFLENBQUE7Z0JBQ1QsT0FBTyxFQUFFLENBQUE7Z0JBRVQsbUJBQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxPQUFPLEtBQUssRUFBRSxJQUFJLENBQUM7cUJBQ2pDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFFWixrQkFBSyxDQUFDLFdBQVcsT0FBTyxjQUFjLEdBQUcsRUFBRSxDQUFDLENBQUE7b0JBQzVDLE9BQU8sSUFBSSxDQUFBO2dCQUNaLENBQUMsQ0FBQztxQkFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7b0JBQ2QsSUFBSSxHQUFHLEVBQUU7d0JBQ1IsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFBO3FCQUNWO29CQUVELE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxNQUFNLENBQUE7b0JBRXpCLElBQUksT0FBTyxJQUFJLEdBQUcsRUFBRTt3QkFDbkIsT0FBTyxHQUFHLElBQUksT0FBTyxFQUFFOzRCQUN0QixNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTs0QkFDaEMsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7NEJBQ25CLEdBQUcsRUFBRSxDQUFBO3lCQUNMO3FCQUNEO29CQUVELE9BQU8sRUFBRSxDQUFBO29CQUVULElBQUksT0FBTyxHQUFHLGFBQWEsRUFBRTt3QkFDNUIsZUFBZSxFQUFFLENBQUE7cUJBQ2pCO3lCQUNJLElBQUksT0FBTyxJQUFJLENBQUMsRUFBRTt3QkFDdEIsSUFBSSxNQUFNLEVBQUU7NEJBQ1gsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO3lCQUNmOzZCQUNJOzRCQUNKLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0NBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTs0QkFDYixDQUFDLENBQUMsQ0FBQTt5QkFDRjtxQkFDRDtnQkFDRixDQUFDLENBQUM7cUJBQ0QsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUNaLGtCQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7b0JBQ1YsT0FBTyxLQUFLLENBQUE7Z0JBQ2IsQ0FBQyxDQUFDLENBQUE7YUFDSDtRQUNGLENBQUM7UUFFRCxlQUFlLEVBQUUsQ0FBQTtJQUNsQixDQUFDLENBQUMsQ0FBQTtBQUNILENBQUM7QUFqRUQsNENBaUVDIn0=