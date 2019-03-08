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
global.settings =
    {
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
        vk: false,
        filenameTemplate: "%country_%username_%date_%id"
    };
const _fs = require("fs");
const _path = require("path");
const _child = require("child_process");
const commander = require("commander");
const _younow = require("./modules/module_younow");
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
const module_update_1 = require("./modules/module_update");
function main(args) {
    return __awaiter(this, void 0, void 0, function* () {
        let commandId = -1;
        commander
            .version(global.settings.version)
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
        if (!global.settings.production) {
            commander
                .command("debug [params...]")
                .description("debug tool ignore this")
                .action(() => commandId = 14);
        }
        module_log_1.debug("args", args);
        commander.parse(args);
        let params = commander.args[0];
        global.verbosity = commander["verbose"] || 0;
        global.settings.pathConfig = commander["config"];
        global.settings.pathDB = _path.join(global.settings.pathConfig, "broadcasters.txt");
        global.settings.pathDownload = commander["dl"] || ".";
        global.settings.noDownload = commander["nodl"];
        global.settings.pathMove = commander["mv"] || null;
        global.settings.parallelDownloads = commander["limit"] || 5;
        global.settings.videoFormat = commander["fmt"];
        global.settings.useFFMPEG = commander["ffmpeg"] || null;
        global.settings.locale = commander["locale"].toLowerCase();
        global.settings.timeout = commander["timer"];
        global.settings.thumbnail = commander["thumb"];
        global.settings.json = commander["json"];
        global.settings.snapchat = commander["snapchat"];
        global.settings.periscope = commander["periscope"];
        global.settings.vk = commander["vk"];
        if (!(global.settings.snapchat || global.settings.periscope || global.settings.vk)) {
            global.settings.younow = true;
        }
        if (!(yield dos.exists(global.settings.pathConfig))) {
            yield dos.createDirectory(global.settings.pathConfig);
        }
        if (global.settings.pathMove) {
            if (!(yield dos.exists(global.settings.pathMove))) {
                yield dos.createDirectory(global.settings.pathMove);
            }
        }
        if (!(yield dos.exists(global.settings.pathDownload))) {
            yield dos.createDirectory(global.settings.pathDownload);
        }
        if (!global.settings.useFFMPEG) {
            switch (global.settings.videoFormat.toLowerCase()) {
                case "mp4":
                    global.settings.useFFMPEG = global.settings.FFMPEG_DEFAULT + " -bsf:a aac_adtstoasc";
                    break;
                case "mkv":
                case "ts":
                    global.settings.useFFMPEG = global.settings.FFMPEG_DEFAULT;
                    break;
                default:
                    module_log_1.error(`Video format ${global.settings.videoFormat} not supported`);
            }
        }
        module_log_1.info(module_log_1.prettify(global.settings));
        if (global.settings.production) {
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
                cmd_vcr_1.cmdVCR(global.settings, params);
                break;
            case 8:
                require("./cmd_follow").cmdFollow(params);
                break;
            case 9:
                require("./cmdFollowed").cmdFollowed(params);
                break;
            case 7:
                cmd_live_1.cmdLive(global.settings, params);
                break;
            case 10:
                cmd_broadcast_1.cmdBroadcast(params);
                break;
            case 11:
                cmd_api_1.cmdAPI(global.settings, params);
                break;
            case 12:
                _younow.openDB()
                    .then((db) => {
                    _fs.rename(global.settings.pathDB, global.settings.pathDB + ".tmp", err => {
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
                require("./cmd_debug").cmdDebug(global.settings, params);
                break;
            default:
                module_log_1.log(`
	Younow-tools version ${global.settings.version}

	As an open source project use it at your own risk. Younow can break it down at any time.

	Report any bug or missing feature at your will.

	If you like this software, please consider a Ƀitcoin donation to 14bpqrNgreKaFtLaK85ArtcUKyAxuKpwJM`);
                commander.help();
        }
    });
}
main(process.argv);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLE1BQU0sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFBO0FBRXBCLE1BQU0sR0FBRyxHQUFZLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0FBRS9DLE1BQU0sQ0FBQyxRQUFRO0lBQ2Q7UUFDQyxPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU87UUFDcEIsTUFBTSxFQUFFLElBQUk7UUFDWixZQUFZLEVBQUUsSUFBSTtRQUNsQiwwQkFBMEIsRUFBRSxLQUFLO1FBQ2pDLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLFFBQVEsRUFBRSxJQUFJO1FBQ2QsVUFBVSxFQUFFLElBQUk7UUFDaEIsaUJBQWlCLEVBQUUsSUFBSTtRQUN2QixTQUFTLEVBQUUsSUFBSTtRQUNmLGNBQWMsRUFBRSwrREFBK0Q7UUFDL0UsV0FBVyxFQUFFLElBQUk7UUFDakIsSUFBSSxFQUFFLElBQUk7UUFDVixNQUFNLEVBQUUsSUFBSTtRQUNaLE9BQU8sRUFBRSxJQUFJO1FBQ2IsVUFBVSxFQUFFLElBQUk7UUFDaEIsVUFBVSxFQUFFLENBQUMsT0FBTyxJQUFJLEdBQUcsQ0FBQztRQUM1QixJQUFJLEVBQUUsS0FBSztRQUNYLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLFFBQVEsRUFBRSxLQUFLO1FBQ2YsU0FBUyxFQUFFLEtBQUs7UUFDaEIsTUFBTSxFQUFFLEtBQUs7UUFDYixFQUFFLEVBQUUsS0FBSztRQUNULGdCQUFnQixFQUFDLDhCQUE4QjtLQUMvQyxDQUFBO0FBRUYsMEJBQXlCO0FBQ3pCLDhCQUE2QjtBQUM3Qix3Q0FBdUM7QUFDdkMsdUNBQXNDO0FBRXRDLG1EQUFrRDtBQUNsRCxxREFBOEU7QUFFOUUsdUNBQWtDO0FBQ2xDLHFEQUFnRDtBQUNoRCx1Q0FBa0M7QUFDbEMsNkNBQXdDO0FBQ3hDLDZDQUF3QztBQUN4Qyx5Q0FBb0M7QUFDcEMsNkNB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