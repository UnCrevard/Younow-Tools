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
    verbosity: 0,
    maxRetry: 2
};
const pkg = require("../package.json");
const FFMPEG_DEFAULT = "-hide_banner -loglevel error -c copy -video_track_timescale 0";
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
        filenameTemplate: null
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
            .option("--younow", "use younow (default)", false)
            .option("--filename <template>", "filename template", "service_country_username_date_type_bid");
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
        global.system.verbosity = commander["verbose"] || 0;
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
        global.settings.filenameTemplate = commander["filename"];
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
                case "flv":
                    global.settings.useFFMPEG = FFMPEG_DEFAULT + " -bsf:a aac_adtstoasc";
                    break;
                case "mkv":
                case "ts":
                    global.settings.useFFMPEG = FFMPEG_DEFAULT;
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
//# sourceMappingURL=main.js.map