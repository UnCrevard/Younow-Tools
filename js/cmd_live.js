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
const dos = require("./modules/module_promixified");
const _path = require("path");
const _younow = require("./modules/module_younow");
const periscope = require("./modules/module_periscope");
const _vk = require("./modules/module_vk");
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
                let broadcast = yield _vk.getBroadcast(user);
                let basename = _path.join(settings.pathDownload, _vk.CreateFilename(broadcast) + ".");
                if (broadcast.mp4 || broadcast.postlive_mp4) {
                    module_log_1.log("download archived live", user);
                    yield module_www_1.download(broadcast.mp4 || broadcast.postlive_mp4, basename + "mp4");
                }
                else if (broadcast.hls) {
                    module_log_1.log("download live", user);
                    let playlist = broadcast.hls.split("?extra=")[0];
                    if (settings.thumbnail) {
                        yield module_www_1.download(broadcast.jpg, basename + "jpg");
                    }
                    if (settings.json) {
                        dos.writeFile(basename + "json", JSON.stringify(broadcast, null, "\t")).catch(module_log_1.error);
                    }
                    module_hls_1.hls(playlist, basename + settings.videoFormat, settings.useFFMPEG, 0, true, cb);
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
                let basename = _path.join(settings.pathDownload, periscope.createFilename(video.broadcast));
                if (settings.thumbnail) {
                    periscope.downloadThumbnail(basename + ".jpg", video.broadcast).catch(module_log_1.error);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kX2xpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9jbWRfbGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscURBQTJEO0FBRTNELGdDQUErQjtBQUMvQixxREFBNEQ7QUFDNUQscURBQTBDO0FBRTFDLG9EQUFtRDtBQUVuRCw4QkFBNkI7QUFFN0IsbURBQWtEO0FBQ2xELHdEQUF1RDtBQUN2RCwyQ0FBMEM7QUFFMUMsaUJBQXdCLFFBQWtCLEVBQUUsS0FBZTtJQUUxRCxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7UUFDcEIsT0FBTyxDQUFDLE1BQU0sRUFBRTthQUNkLElBQUksQ0FBQyxDQUFDLEVBQU0sRUFBRSxFQUFFO1lBQ2hCLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLFVBQVMsSUFBSSxFQUFFLE9BQU87Z0JBQzlDLElBQUksR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFBO2dCQUVoQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFBO2dCQUVwRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNiLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTt3QkFDbkIsa0JBQUssQ0FBQyxHQUFHLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO3FCQUNuRDt5QkFDSSxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksaUJBQWlCLEVBQUU7d0JBQ3pDLGtCQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFBO3FCQUN4Qzt5QkFDSTt3QkFDSixPQUFP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