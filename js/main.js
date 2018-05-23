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
const _fs = require("fs");
const _path = require("path");
const commander = require("commander");
let pkg = require("../package.json");
try {
    require("source-map-support").install();
}
catch (e) {
}
exports.settings = {
    version: pkg.version,
    pathDB: null,
    pathDownload: null,
    generateDownloadFolderDate: false,
    noDownload: null,
    pathMove: null,
    pathConfig: null,
    parallelDownloads: null,
    useFFMPEG: null,
    FFMPEG_DEFAULT: "-hide_banner -loglevel error -c copy -video_track_timescale 0",
    videoFormat: null,
    args: null,
    locale: null,
    timeout: null,
    debug_file: null
};
const _younow = require("./module_younow");
const module_log_1 = require("./modules/module_log");
const cmd_add_1 = require("./cmd_add");
const cmd_annotation_1 = require("./cmd_annotation");
const cmd_api_1 = require("./cmd_api");
const cmd_ignore_1 = require("./cmd_ignore");
const cmd_remove_1 = require("./cmd_remove");
const cmd_scan_1 = require("./cmd_scan");
const cmd_search_1 = require("./cmd_search");
const cmd_vcr_1 = require("./cmd_vcr");
const cmd_live_1 = require("./cmd_live");
const cmd_broadcast_1 = require("./cmd_broadcast");
const dos = require("./modules/module_promixified");
function main(args) {
    return __awaiter(this, void 0, void 0, function* () {
        commander
            .version(exports.settings.version)
            .option("-v, --verbose", "verbosity level (-v -vv -vvv)", ((x, v) => v + 1), 0)
            .option("--dl <path>", "download path (default current dir)")
            .option("--nodl", "Execute commands without downloading", false)
            .option("--mv <path>", "at the end MOVE files to this path (default do nothing)")
            .option("-t --timer <minutes>", "scan interval (default 5 minutes)", 5)
            .option("-l --limit <number>", "number of parallel downloads for a stream (default 5)")
            .option("--ffmpeg <arguments>", "use ffmpeg (must be in your path) to parse and write the video stream (advanced)", false)
            .option("--fmt <format>", "change the output format (FFMPEG will be enabled)", "ts")
            .option(`--locale <xx>`, `change the default (en) locale (ww|en|de|es|tr|me)`, `en`)
            .option("--config <path>", "change config folder", _path.join(process.env.APPDATA || process.env.HOME, "YounowTools"));
        commander
            .command("follow <users...>")
            .description("record/monitor broadcasts followed (aka FanOf on profile page) from any user(s) or your account.")
            .action((user, cmd) => commandId = 8);
        commander
            .command("add <users...>")
            .description("add user(s) by username, uid, URL to db")
            .action((users, cmd) => commandId = 0);
        commander
            .command("remove <users...>")
            .alias("rm")
            .description("remove users(s) by username, uid, URL from db")
            .action((users, cmd) => commandId = 1);
        commander
            .command("ignore <users...>")
            .description("ignore/unignore users(s) by username, uid, URL from db")
            .action((users, cmd) => commandId = 2);
        commander
            .command(`note <user> [text]`)
            .description(`add a "note" (quoted) to a user in db`)
            .action((users, cmd) => commandId = 5);
        commander
            .command("search <patterns...>")
            .description("search in db for matching pattern(s)")
            .action((users, cmd) => commandId = 3);
        commander
            .command("resolve <users...>")
            .description("resolve user(s) online")
            .action((users, cmd) => commandId = 4);
        commander
            .command("followed <users...>")
            .description(`list followed of user(s)`)
            .action(users => commandId = 9);
        commander
            .command("vcr <users...>")
            .description("download archived broadcast if available")
            .action((users, cmd) => commandId = 6);
        commander
            .command("live <users...>")
            .description("download live broadcast from the beginning")
            .action((users, cmd) => commandId = 7);
        commander
            .command("broadcast <broadcastId...>")
            .description("download broadcastId ")
            .action((users, cmd) => commandId = 10);
        commander
            .command("scan <config_file>")
            .description("scan live broadcasts")
            .action((users, cmd) => commandId = 13);
        commander
            .command("api")
            .description("api compatibility test (advanced)")
            .action((users, cmd) => commandId = 11);
        commander
            .command("fixdb")
            .description("normalize db informations (advanced)")
            .action((users, cmd) => commandId = 12);
        commander
            .command("debug [params...]")
            .description("debug tool ignore this")
            .action(() => commandId = 14);
        let commandId = -1;
        commander.parse(args);
        let params = commander.args[0];
        module_log_1.setVerbose(commander["verbose"] || 0);
        exports.settings.pathConfig = commander["config"];
        exports.settings.pathDB = _path.join(exports.settings.pathConfig, "broadcasters.txt");
        exports.settings.pathDownload = commander["dl"] || ".";
        exports.settings.noDownload = commander["nodl"];
        exports.settings.pathMove = commander["mv"] || null;
        exports.settings.parallelDownloads = commander["limit"] || 5;
        exports.settings.videoFormat = commander["fmt"];
        exports.settings.useFFMPEG = commander["ffmpeg"];
        exports.settings.locale = commander["locale"].toLowerCase();
        exports.settings.timeout = commander["timer"];
        if (!(yield dos.exists(exports.settings.pathConfig))) {
            yield dos.createDirectory(exports.settings.pathConfig);
        }
        if (exports.settings.pathMove) {
            if (!(yield dos.exists(exports.settings.pathMove))) {
                yield dos.createDirectory(exports.settings.pathMove);
            }
        }
        if (!(yield dos.exists(exports.settings.pathDownload))) {
            yield dos.createDirectory(exports.settings.pathDownload);
        }
        if (exports.settings.videoFormat.toLowerCase() != "ts") {
            if (!exports.settings.useFFMPEG) {
                switch (exports.settings.videoFormat.toLowerCase()) {
                    case "mp4":
                        exports.settings.useFFMPEG = exports.settings.FFMPEG_DEFAULT + " -bsf:a aac_adtstoasc";
                        break;
                    case "mkv":
                        exports.settings.useFFMPEG = exports.settings.FFMPEG_DEFAULT;
                        break;
                    default:
                        module_log_1.error(`Video format ${exports.settings.videoFormat} not supported`);
                }
            }
        }
        module_log_1.info(module_log_1.prettify(exports.settings));
        switch (commandId) {
            case 13:
                cmd_scan_1.cmdScan(params);
                break;
            case 3:
                cmd_search_1.cmdSearch(params);
                break;
            case 4:
                cmd_search_1.cmdResolve(params);
                break;
            case 5:
                cmd_annotation_1.cmdAnnotation(params, commander.args[1] || "---");
                break;
            case 6:
                cmd_vcr_1.cmdVCR(params);
                break;
            case 8:
                require("./cmd_follow").cmdFollow(params);
                break;
            case 9:
                require("./cmdFollowed").cmdFollowed(params);
                break;
            case 7:
                cmd_live_1.cmdLive(params);
                break;
            case 10:
                cmd_broadcast_1.cmdBroadcast(params);
                break;
            case 11:
                cmd_api_1.cmdAPI();
                break;
            case 12:
                _younow.openDB()
                    .then((db) => {
                    _fs.rename(exports.settings.pathDB, exports.settings.pathDB + ".tmp", err => {
                        if (err) {
                            module_log_1.error(err);
                        }
                        else {
                            for (let user in db) {
                                if (!isNaN(user)) {
                                    db[user] = _younow.convertToUserDB(user, db[user]);
                                }
                            }
                        }
                    });
                })
                    .catch(module_log_1.error);
                break;
            case 1:
                cmd_remove_1.cmdRemove(params);
                break;
            case 0:
                cmd_add_1.cmdAdd(params);
                break;
            case 2:
                cmd_ignore_1.cmdIgnore(params);
                break;
            case 14:
                require("./cmd_debug").cmdDebug(params);
                break;
            default:
                module_log_1.log(`
	Younow-tools version ${exports.settings.version}

	As an open source project use it at your own risk. Younow can break it down at any time.

	Report any bug or missing feature at your will.

	If you like this software, please consider a Ƀitcoin donation to 14bpqrNgreKaFtLaK85ArtcUKyAxuKpwJM`);
                commander.help();
        }
    });
}
main(process.argv).catch(module_log_1.error);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDBCQUF5QjtBQUN6Qiw4QkFBNkI7QUFFN0IsdUNBQXNDO0FBR3RDLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0FBRXBDLElBQUk7SUFHSCxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtDQUN2QztBQUNELE9BQU8sQ0FBQyxFQUFFO0NBRVQ7QUFFVSxRQUFBLFFBQVEsR0FDbEI7SUFDQyxPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU87SUFDcEIsTUFBTSxFQUFFLElBQUk7SUFDWixZQUFZLEVBQUUsSUFBSTtJQUNsQiwwQkFBMEIsRUFBRSxLQUFLO0lBQ2pDLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFFBQVEsRUFBRSxJQUFJO0lBQ2QsVUFBVSxFQUFFLElBQUk7SUFDaEIsaUJBQWlCLEVBQUUsSUFBSTtJQUN2QixTQUFTLEVBQUUsSUFBSTtJQUNmLGNBQWMsRUFBRSwrREFBK0Q7SUFDL0UsV0FBVyxFQUFFLElBQUk7SUFDakIsSUFBSSxFQUFFLElBQUk7SUFDVixNQUFNLEVBQUUsSUFBSTtJQUNaLE9BQU8sRUFBRSxJQUFJO0lBQ2IsVUFBVSxFQUFFLElBQUk7Q0FDaEIsQ0FBQTtBQUVGLDJDQUEwQztBQUMxQyxxREFBMEY7QUFFMUYsdUNBQWtDO0FBQ2xDLHFEQUFnRDtBQUNoRCx1Q0FBa0M7QUFDbEMsNkNBQXdDO0FBQ3hDLDZDQUF3QztBQUN4Qyx5Q0FBb0M7QUFDcEMsNkNBQW9EO0FBQ3BELHVDQUFrQztBQUNsQyx5Q0FBb0M7QUFDcEMsbURBQThDO0FBQzlDLG9EQUFtRDtBQW9CbkQsY0FBb0IsSUFBSTs7UUFDdkIsU0FBUzthQUNQLE9BQU8sQ0FBQyxnQkFBUSxDQUFDLE9BQU8sQ0FBQzthQUN6QixNQUFNLENBQUMsZUFBZSxFQUFFLCtCQUEr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