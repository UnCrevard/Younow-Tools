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
const module_log_1 = require("../modules/module_log");
const _younow = require("../modules/module_younow");
const _path = require("path");
const _os = require("os");
const module_ffmpeg_1 = require("../module_ffmpeg");
const FFMPEG_DEFAULT = "-loglevel error -c copy -video_track_timescale 0 -y";
function swallowError(err) {
    return null;
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield _younow.getLiveBroadcastByUsername("TheDapperRapper");
        let moments = yield _younow.getMoments(user.userId, 0);
        let types = {};
        for (let moment of moments.items) {
            if (Object.keys(types).length) {
            }
            else {
                types[moment.type] = true;
                module_log_1.log(moment.type, moment.broadcaster.name, moment.broadcastId, new Date(moment.created * 1000));
                let outfile = _path.join(_os.tmpdir(), moment.broadcaster.name + "_" + moment.broadcastId + ".ts");
                let url = `https://cdn.younow.com/php/api/broadcast/videoPath/hls=1/broadcastId=${moment.broadcastId}`;
                module_ffmpeg_1.ffmpeg(url, outfile, FFMPEG_DEFAULT);
            }
        }
    });
}
main();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9obHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9UZXN0cy90ZXN0X2hscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsc0RBQXFEO0FBQ3JELG9EQUFtRDtBQUVuRCw4QkFBNkI7QUFDN0IsMEJBQXlCO0FBR3pCLG9EQUF5QztBQUd6QyxNQUFNLGNBQWMsR0FBRyxxREFBcUQsQ0FBQTtBQUU1RSxzQkFBc0IsR0FBRztJQUN4QixPQUFPLElBQUksQ0FBQTtBQUNaLENBQUM7QUE0Q0Q7O1FBQ0MsSUFBSSxJQUFJLEdBQUcsTUFBTSxPQUFPLENBQUMsMEJBQTBCLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtRQUV0RSxJQUFJLE9BQU8sR0FBRyxNQUFNLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUV0RCxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUE7UUFFZCxLQUFLLElBQUksTUFBTSxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7WUFDakMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRTthQUU5QjtpQkFDSTtnQkFDSixLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQTtnQkFFekIsZ0JBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxXQUFXLEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFBO2dCQUU5RixJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsQ0FBQTtnQkFFbEcsSUFBSSxHQUFHLEdBQUcsd0VBQXdFLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQTtnQkFFdEcsc0JBQU0sQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFBO2FBQ3BDO1NBQ0Q7SUFFRixDQUFDO0NBQUE7QUFFRCxJQUFJLEVBQUUsQ0FBQSJ9