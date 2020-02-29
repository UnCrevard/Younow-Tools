"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
//# sourceMappingURL=cmd_live.js.map