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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLE1BQU0sQ0FBQyxNQUFNLEdBQUc7SUFDZixtQkFBbUIsRUFBRSxFQUFFO0lBQ3ZCLFNBQVMsRUFBRSxDQUFDO0lBQ1osUUFBUSxFQUFFLENBQUM7Q0FDWCxDQUFBO0FBRUQsTUFBTSxHQUFHLEdBQVksT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUE7QUFDL0MsTUFBTSxjQUFjLEdBQUUsK0RBQStELENBQUE7QUFFckYsTUFBTSxDQUFDLFFBQVE7SUFDZDtRQUNDLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTztRQUNwQixNQUFNLEVBQUUsSUFBSTtRQUNaLFlBQVksRUFBRSxJQUFJO1FBQ2xCLDBCQUEwQixFQUFFLEtBQUs7UUFDakMsVUFBVSxFQUFFLElBQUk7UUFDaEIsUUFBUSxFQUFFLElBQUk7UUFDZCxVQUFVLEVBQUUsSUFBSTtRQUNoQixpQkFBaUIsRUFBRSxJQUFJO1FBQ3ZCLFNBQVMsRUFBRSxJQUFJO1FBQ2YsV0FBVyxFQUFFLElBQUk7UUFDakIsSUFBSSxFQUFFLElBQUk7UUFDVixNQUFNLEVBQUUsSUFBSTtRQUNaLE9BQU8sRUFBRSxJQUFJO1FBQ2IsVUFBVSxFQUFFLElBQUk7UUFDaEIsVUFBVSxFQUFFLENBQUMsT0FBTyxJQUFJLEdBQUcsQ0FBQztRQUM1QixJQUFJLEVBQUUsS0FBSztRQUNYLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLFFBQVEsRUFBRSxLQUFLO1FBQ2YsU0FBUyxFQUFFLEtBQUs7UUFDaEIsTUFBTSxFQUFFLEtBQUs7UUFDYixFQUFFLEVBQUUsS0FBSztRQVNULGdCQUFnQixFQUFDLElBQUk7S0FDckIsQ0FBQTtBQUVGLDBCQUF5QjtBQUN6Qiw4QkFBNkI7QUFDN0Isd0NBQXVDO0FBQ3ZDLHVDQUFzQztBQUV0QyxtREFBa0Q7QUFDbEQscURBQThFO0FBRTlFLHVDQUFrQztBQUNs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