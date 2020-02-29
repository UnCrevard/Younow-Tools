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
global.system = {
    maxParallelDownload: 10,
    verbosity: 2,
    maxRetry: 2
};
global.settings =
    {
        locale: "en"
    };
const module_log_1 = require("../modules/module_log");
const _younow = require("../modules/module_younow");
const P = require("../modules/module_promixified");
const FFMPEG_DEFAULT = "-loglevel error -c copy -video_track_timescale 0 -y";
function swallowError(err) {
    return null;
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let trendings = yield _younow.getTrendings();
        trendings.trending_tags.forEach(tag => {
            module_log_1.log(tag.tag, tag.score);
        });
        let girls = yield _younow.getTagInfo("girls");
        girls.queues[0].items.forEach(girl => {
            if (girl.userlevel < 5)
                module_log_1.log(module_log_1.prettify(girl));
        });
        let user = trendings.trending_users[0];
        let broadcast = yield _younow.getLiveBroadcastByUID(user.userId);
        module_log_1.log(broadcast.PlayDataBaseUrl, broadcast.media);
        while (true) {
            try {
                let archive = yield _younow.getArchivedBroadcast(user.broadcastId);
                if (archive.errorCode) {
                    module_log_1.error(_younow.errortoString(archive));
                }
                else {
                    module_log_1.log(module_log_1.prettify(archive));
                    break;
                }
                yield P.timeout(60 * 1000 * 5);
            }
            catch (err) {
                module_log_1.error(err);
            }
        }
    });
}
main();
//# sourceMappingURL=test_hls.js.map