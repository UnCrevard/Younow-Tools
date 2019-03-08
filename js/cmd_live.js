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
                let basename = _vk.CreateFilename(broadcast) + ".";
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
                let basename = periscope.createFilename(video.broadcast);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kX2xpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9jbWRfbGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscURBQTJEO0FBRTNELGdDQUErQjtBQUMvQixxREFBNEQ7QUFDNUQscURBQTBDO0FBRTFDLG9EQUFtRDtBQUluRCxtREFBa0Q7QUFDbEQsd0RBQXVEO0FBQ3ZELDJDQUEwQztBQUUxQyxpQkFBd0IsUUFBa0IsRUFBRSxLQUFlO0lBRTFELElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTtRQUNwQixPQUFPLENBQUMsTUFBTSxFQUFFO2FBQ2QsSUFBSSxDQUFDLENBQUMsRUFBTSxFQUFFLEVBQUU7WUFDaEIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsVUFBUyxJQUFJLEVBQUUsT0FBTztnQkFDOUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBRWhDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBRXBHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ2IsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO3dCQUNuQixrQkFBSyxDQUFDLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7cUJBQ25EO3lCQUNJLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxpQkFBaUIsRUFBRTt3QkFDekMsa0JBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUE7cUJBQ3hDO3lCQUNJO3dCQUNKLE9BQU8sQ0FBQyxlQUFlLENB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