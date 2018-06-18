"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const module_log_1 = require("./modules/module_log");
const _async = require("async");
const module_www_1 = require("./modules/module_www");
const module_hls_1 = require("./modules/module_hls");
const module_utils_1 = require("./modules/module_utils");
const dos = require("./modules/module_promixified");
const path = require("path");
const _younow = require("./module_younow");
const periscope = require("./module_periscope");
function cmdLive(settings, users) {
    if (settings.younow) {
        _younow.openDB()
            .then((db) => {
            _async.eachSeries(users, function (user, cbAsync) {
                user = _younow.extractUser(user);
                let p = isNaN(user) ? _younow.getLiveBroadcastByUsername(user) : _younow.getLiveBroadcastByUID(user);
                p.then(live => {
                    if (live.errorCode) {
                        module_log_1.error(`${user} ${live.errorCode} ${live.errorMsg}`);
                    }
                    else if (live.state != "onBroadcastPlay") {
                        module_log_1.error(`${live.state} ${live.stateCopy}`);
                    }
                    else {
                        _younow.downloadThemAll(live)
                            .then(result => {
                            module_log_1.log(`${live.profile} broadcast is over`);
                            return true;
                        }, module_log_1.error);
                    }
                }, module_log_1.error)
                    .then(() => {
                    cbAsync();
                });
            });
        })
            .catch(module_log_1.error);
    }
    else if (settings.vk) {
        _async.eachSeries(users, (user, cb) => {
            module_log_1.log("try to resolve", user);
            module_www_1.getURL(user, null)
                .then((body) => __awaiter(this, void 0, void 0, function* () {
                let m = body.toString().match(/playerParams.=.(.+?);\n/);
                if (m) {
                    let json = JSON.parse(m[1]);
                    let params = json.params[0];
                    let basename = path.join(settings.pathDownload, module_utils_1.cleanFilename(params.md_author +
                        "_" + params.md_title +
                        "_" + params.vid +
                        "_" + params.oid)) + ".";
                    if (params.mp4 || params.postlive_mp4) {
                        module_log_1.log("download archived live", user);
                        yield module_www_1.download(params.mp4 || params.postlive_mp4, basename + "mp4");
                    }
                    else if (params.hls) {
                        module_log_1.log("download live", user);
                        let playlist = params.hls.split("?extra=")[0];
                        if (settings.thumbnail) {
                            yield module_www_1.download(params.jpg, basename + "jpg");
                        }
                        if (settings.json) {
                            dos.writeFile(basename + "json", JSON.stringify(json, null, "\t")).catch(module_log_1.error);
                        }
                        module_hls_1.hls(playlist, basename + settings.videoFormat, settings.useFFMPEG, 0, true, cb);
                    }
                }
                else {
                    module_log_1.log(body.toString().match(/<div.id="video_ext_msg">\s*(.+?)\s*<\/div>/)[1]);
                }
            }))
                .catch(module_log_1.error);
        });
    }
    else if (settings.periscope) {
        _async.eachSeries(users, (user, cb) => {
            module_log_1.log("try to resolve", user);
            let pos = user.lastIndexOf("/");
            periscope.getBroadcast(user.substring(pos + 1))
                .then(video => {
                module_log_1.log("download", video.broadcast.user_display_name, video.broadcast.status);
                let basename = periscope.createFilename(video.broadcast);
                if (settings.thumbnail) {
                    periscope.downloadThumbnail(video.broadcast).catch(module_log_1.error);
                }
                if (settings.json) {
                    dos.writeFile(basename + ".json", JSON.stringify(video, null, "\t")).catch(module_log_1.error);
                }
                return periscope.downloadVideo(basename + "." + settings.videoFormat, video);
            })
                .catch(module_log_1.error);
        });
    }
    else {
        module_log_1.error("Not Implemented");
    }
}
exports.cmdLive = cmdLive;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kX2xpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9jbWRfbGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscURBQTJEO0FBRTNELGdDQUErQjtBQUMvQixxREFBNEQ7QUFDNUQscURBQTBDO0FBQzFDLHlEQUFzRDtBQUN0RCxvREFBbUQ7QUFFbkQsNkJBQTRCO0FBRTVCLDJDQUEwQztBQUMxQyxnREFBK0M7QUFFL0MsaUJBQXdCLFFBQWtCLEVBQUUsS0FBZTtJQUUxRCxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7UUFDcEIsT0FBTyxDQUFDLE1BQU0sRUFBRTthQUNkLElBQUksQ0FBQyxDQUFDLEVBQU0sRUFBRSxFQUFFO1lBQ2hCLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLFVBQVMsSUFBSSxFQUFFLE9BQU87Z0JBQzlDLElBQUksR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFBO2dCQUVoQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFBO2dCQUVwRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNiLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTt3QkFDbkIsa0JBQUssQ0FBQyxHQUFHLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO3FCQUNuRDt5QkFDSSxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksaUJBQWlCLEVBQUU7d0JBQ3pDLGtCQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFBO3FCQUN4Qzt5QkFDSTt3QkFDSixPQUFP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