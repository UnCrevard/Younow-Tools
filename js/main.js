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
global.verbosity = 0;
const pkg = require("../package.json");
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
    debug_file: null,
    production: ("_from" in pkg)
};
const _fs = require("fs");
const _path = require("path");
const _child = require("child_process");
const commander = require("commander");
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
const module_utils_1 = require("./modules/module_utils");
const module_update_1 = require("./module_update");
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
            .alias("bc")
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
        global.verbosity = commander["verbose"] || 0;
        exports.settings.pathConfig = commander["config"];
        exports.settings.pathDB = _path.join(exports.settings.pathConfig, "broadcasters.txt");
        exports.settings.pathDownload = commander["dl"] || ".";
        exports.settings.noDownload = commander["nodl"];
        exports.settings.pathMove = commander["mv"] || null;
        exports.settings.parallelDownloads = commander["limit"] || 5;
        exports.settings.videoFormat = commander["fmt"];
        exports.settings.useFFMPEG = exports.settings.FFMPEG_DEFAULT;
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
        if (exports.settings.production) {
            setTimeout(module_update_1.checkUpdate, 30 * module_utils_1.Time.SECOND);
        }
        else {
            module_log_1.error("dev mode detected");
        }
        let isFFMPEG = _child.spawn("ffmpeg", ["-version"]);
        isFFMPEG.on("error", err => {
            module_log_1.error(`ffmpeg is missing !!! You MUST install it before using Younow-Tools.`);
            module_log_1.error(`On windows go to https://ffmpeg.zeranoe.com/builds/ and install it and make it available in path`);
            module_log_1.error(err);
            process.exit(-1);
        });
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
main(process.argv);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLE1BQU0sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFBO0FBRXBCLE1BQU0sR0FBRyxHQUFZLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0FBRXBDLFFBQUEsUUFBUSxHQUNuQjtJQUNDLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTztJQUNwQixNQUFNLEVBQUUsSUFBSTtJQUNaLFlBQVksRUFBRSxJQUFJO0lBQ2xCLDBCQUEwQixFQUFFLEtBQUs7SUFDakMsVUFBVSxFQUFFLElBQUk7SUFDaEIsUUFBUSxFQUFFLElBQUk7SUFDZCxVQUFVLEVBQUUsSUFBSTtJQUNoQixpQkFBaUIsRUFBRSxJQUFJO0lBQ3ZCLFNBQVMsRUFBRSxJQUFJO0lBQ2YsY0FBYyxFQUFFLCtEQUErRDtJQUMvRSxXQUFXLEVBQUUsSUFBSTtJQUNqQixJQUFJLEVBQUUsSUFBSTtJQUNWLE1BQU0sRUFBRSxJQUFJO0lBQ1osT0FBTyxFQUFFLElBQUk7SUFDYixVQUFVLEVBQUUsSUFBSTtJQUNoQixVQUFVLEVBQUUsQ0FBQyxPQUFPLElBQUksR0FBRyxDQUFDO0NBQzVCLENBQUE7QUFFRCwwQkFBeUI7QUFDekIsOEJBQTZCO0FBQzdCLHdDQUF1QztBQUN2Qyx1Q0FBc0M7QUFFdEMsMkNBQTBDO0FBQzFDLHFEQUE4RTtBQUU5RSx1Q0FBa0M7QUFDbEMscURBQWdEO0FBQ2hELHVDQUFrQztBQUNsQyw2Q0FBd0M7QUFDeEMsNkNBQXdDO0FBQ3hDLHlDQUFvQztBQUNwQyw2Q0FBb0Q7QUFDcEQsdUNBQWtDO0FBQ2xDLHlDQUFvQztBQUNwQyxtREFBOEM7QUFDOUMsb0RBQW1EO0FBQ25ELHlEQUE2QztBQUU3QyxtREFBNkM7QUFvQjdDLGNBQW9CLElBQUk7O1FBQ3ZCLFNBQVM7YUFDUCxPQUFPLENBQUMsZ0JBQVEsQ0FBQyxPQUFPLENBQUM7YUFD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