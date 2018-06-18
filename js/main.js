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
    production: ("_from" in pkg),
    json: false,
    thumbnail: false,
    snapchat: false,
    periscope: false,
    younow: false,
    vk: false
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
const module_update_1 = require("./module_update");
function main(args) {
    return __awaiter(this, void 0, void 0, function* () {
        let commandId = -1;
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
            .option("--config <path>", "change config folder", _path.join(process.env.APPDATA || process.env.HOME, "YounowTools"))
            .option("--json", "save stream informations (advanced)", false)
            .option("--thumb", "save stream thumbnail", false)
            .option("--snapchat", "use snapchat (experimental)", false)
            .option("--periscope", "use periscope (experimental)", false)
            .option("--vk", "use vk (experimental)", false)
            .option("--younow", "use younow (default)", false);
        commander
            .command("follow <users...>")
            .description("record/monitor broadcasts followed (aka FanOf on profile page) from any user(s) or your account.")
            .action((user, cmd) => commandId = 8);
        commander
            .command("add <users...>")
            .description("(younow) add user(s) by username, uid, URL to db")
            .action((users, cmd) => commandId = 0);
        commander
            .command("remove <users...>")
            .alias("rm")
            .description("(younow) remove users(s) by username, uid, URL from db")
            .action((users, cmd) => commandId = 1);
        commander
            .command("ignore <users...>")
            .description("(younow) ignore/unignore users(s) by username, uid, URL from db")
            .action((users, cmd) => commandId = 2);
        commander
            .command(`note <user> [text]`)
            .description(`(younow) add a "note" (quoted) to a user in db`)
            .action((users, cmd) => commandId = 5);
        commander
            .command("search <patterns...>")
            .description("(younow) search in db for matching pattern(s)")
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
            .description("download archived broadcast(s) if available +snapchat +periscope +vk")
            .action((users, cmd) => commandId = 6);
        commander
            .command("live <users...>")
            .description("download live or archived broadcast(s) +periscope +vk")
            .action((users, cmd) => commandId = 7);
        commander
            .command("broadcast <broadcastId...>")
            .alias("bc")
            .description("(younow) download broadcastId(s)")
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
            .description("(younow) normalize db informations (advanced)")
            .action((users, cmd) => commandId = 12);
        if (!exports.settings.production) {
            commander
                .command("debug [params...]")
                .description("debug tool ignore this")
                .action(() => commandId = 14);
        }
        module_log_1.debug("args", args);
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
        exports.settings.useFFMPEG = commander["ffmpeg"] || null;
        exports.settings.locale = commander["locale"].toLowerCase();
        exports.settings.timeout = commander["timer"];
        exports.settings.thumbnail = commander["thumb"];
        exports.settings.json = commander["json"];
        exports.settings.snapchat = commander["snapchat"];
        exports.settings.periscope = commander["periscope"];
        exports.settings.vk = commander["vk"];
        if (!(exports.settings.snapchat || exports.settings.periscope || exports.settings.vk)) {
            exports.settings.younow = true;
        }
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
        if (!exports.settings.useFFMPEG) {
            switch (exports.settings.videoFormat.toLowerCase()) {
                case "mp4":
                    exports.settings.useFFMPEG = exports.settings.FFMPEG_DEFAULT + " -bsf:a aac_adtstoasc";
                    break;
                case "mkv":
                case "ts":
                    exports.settings.useFFMPEG = exports.settings.FFMPEG_DEFAULT;
                    break;
                default:
                    module_log_1.error(`Video format ${exports.settings.videoFormat} not supported`);
            }
        }
        module_log_1.info(module_log_1.prettify(exports.settings));
        if (exports.settings.production) {
            module_update_1.checkUpdate();
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
                cmd_vcr_1.cmdVCR(exports.settings, params);
                break;
            case 8:
                require("./cmd_follow").cmdFollow(params);
                break;
            case 9:
                require("./cmdFollowed").cmdFollowed(params);
                break;
            case 7:
                cmd_live_1.cmdLive(exports.settings, params);
                break;
            case 10:
                cmd_broadcast_1.cmdBroadcast(params);
                break;
            case 11:
                cmd_api_1.cmdAPI(exports.settings, params);
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
                require("./cmd_debug").cmdDebug(exports.settings, params);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLE1BQU0sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFBO0FBRXBCLE1BQU0sR0FBRyxHQUFZLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0FBRXBDLFFBQUEsUUFBUSxHQUNuQjtJQUNDLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTztJQUNwQixNQUFNLEVBQUUsSUFBSTtJQUNaLFlBQVksRUFBRSxJQUFJO0lBQ2xCLDBCQUEwQixFQUFFLEtBQUs7SUFDakMsVUFBVSxFQUFFLElBQUk7SUFDaEIsUUFBUSxFQUFFLElBQUk7SUFDZCxVQUFVLEVBQUUsSUFBSTtJQUNoQixpQkFBaUIsRUFBRSxJQUFJO0lBQ3ZCLFNBQVMsRUFBRSxJQUFJO0lBQ2YsY0FBYyxFQUFFLCtEQUErRDtJQUMvRSxXQUFXLEVBQUUsSUFBSTtJQUNqQixJQUFJLEVBQUUsSUFBSTtJQUNWLE1BQU0sRUFBRSxJQUFJO0lBQ1osT0FBTyxFQUFFLElBQUk7SUFDYixVQUFVLEVBQUUsSUFBSTtJQUNoQixVQUFVLEVBQUUsQ0FBQyxPQUFPLElBQUksR0FBRyxDQUFDO0lBQzVCLElBQUksRUFBRSxLQUFLO0lBQ1gsU0FBUyxFQUFFLEtBQUs7SUFDaEIsUUFBUSxFQUFFLEtBQUs7SUFDZixTQUFTLEVBQUUsS0FBSztJQUNoQixNQUFNLEVBQUUsS0FBSztJQUNiLEVBQUUsRUFBRSxLQUFLO0NBRVQsQ0FBQTtBQUVELDBCQUF5QjtBQUN6Qiw4QkFBNkI7QUFDN0Isd0NBQXVDO0FBQ3ZDLHVDQUFzQztBQUV0QywyQ0FBMEM7QUFDMUMscURBQThFO0FBRTlFLHVDQUFrQztBQUNsQyxxREFBZ0Q7QUFDaEQsdUNBQWtDO0FBQ2xDLDZDQUF3QztBQUN4Qyw2Q0FBd0M7QUFDeEMseUNBQW9DO0FBQ3BDLDZDQUFvRDtBQUNwRCx1Q0FBa0M7QUFDbEMseUNBQW9D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