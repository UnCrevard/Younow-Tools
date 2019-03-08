
global.system = {
	maxParallelDownload: 10,
	verbosity: 0,
	maxRetry: 2
}

const pkg: Package = require("../package.json")
const FFMPEG_DEFAULT= "-hide_banner -loglevel error -c copy -video_track_timescale 0"

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
		/*

		title
		date
		id
		type

		*/
		filenameTemplate:null
	}

import * as _fs from "fs"
import * as _path from "path"
import * as _child from "child_process"
import * as commander from "commander"
import * as _async from "async"
import * as _younow from "./modules/module_younow"
import { log, info, debug, dump, error, prettify } from "./modules/module_log"
import { FakeDB } from "./modules/module_db"
import { cmdAdd } from "./cmd_add"
import { cmdAnnotation } from "./cmd_annotation"
import { cmdAPI } from "./cmd_api"
import { cmdIgnore } from "./cmd_ignore"
import { cmdRemove } from "./cmd_remove"
import { cmdScan } from "./cmd_scan"
import { cmdResolve, cmdSearch } from "./cmd_search"
import { cmdVCR } from "./cmd_vcr"
import { cmdLive } from "./cmd_live"
import { cmdBroadcast } from "./cmd_broadcast"
import * as dos from "./modules/module_promixified"
import { Time } from "./modules/module_utils"

import { checkUpdate } from "./modules/module_update"

const enum CommandID {
	add,
	remove,
	ignore,
	search,
	resolve,
	annotation,
	vcr,
	live,
	follow,
	followed,
	broadcast,
	api,
	fixdb,
	scan,
	debug
}

async function main(args) {

	let commandId = -1

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
		.option("--filename <template>","filename template","service_country_username_date_type_bid")

	commander
		.command("follow <users...>")
		.description("record/monitor broadcasts followed (aka FanOf on profile page) from any user(s) or your account.")
		.action((user, cmd) => commandId = CommandID.follow)

	commander
		.command("add <users...>")
		.description("(younow) add user(s) by username, uid, URL to db")
		.action((users, cmd) => commandId = CommandID.add)

	commander
		.command("remove <users...>")
		.alias("rm")
		.description("(younow) remove users(s) by username, uid, URL from db")
		.action((users, cmd) => commandId = CommandID.remove)

	commander
		.command("ignore <users...>")
		.description("(younow) ignore/unignore users(s) by username, uid, URL from db")
		.action((users, cmd) => commandId = CommandID.ignore)

	commander
		.command(`note <user> [text]`)
		.description(`(younow) add a "note" (quoted) to a user in db`)
		.action((users, cmd) => commandId = CommandID.annotation)

	commander
		.command("search <patterns...>")
		.description("(younow) search in db for matching pattern(s)")
		.action((users, cmd) => commandId = CommandID.search)

	commander
		.command("resolve <users...>")
		.description("resolve user(s) online")
		.action((users, cmd) => commandId = CommandID.resolve)

	commander
		.command("followed <users...>")
		.description(`list followed of user(s)`)
		.action(users => commandId = CommandID.followed)

	commander
		.command("vcr <users...>")
		.description("download archived broadcast(s) if available +snapchat +periscope +vk")
		.action((users, cmd) => commandId = CommandID.vcr)

	commander
		.command("live <users...>")
		.description("download live or archived broadcast(s) +periscope +vk")
		.action((users, cmd) => commandId = CommandID.live)

	commander
		.command("broadcast <broadcastId...>")
		.alias("bc")
		.description("(younow) download broadcastId(s)")
		.action((users, cmd) => commandId = CommandID.broadcast)

	commander
		.command("scan <config_file>")
		.description("scan live broadcasts")
		.action((users, cmd) => commandId = CommandID.scan)

	commander
		.command("api")
		.description("api compatibility test (advanced)")
		.action((users, cmd) => commandId = CommandID.api)

	commander
		.command("fixdb")
		.description("(younow) normalize db informations (advanced)")
		.action((users, cmd) => commandId = CommandID.fixdb)

	if (!global.settings.production) {
		commander
			.command("debug [params...]")
			.description("debug tool ignore this")
			.action(() => commandId = CommandID.debug)
	}

	debug("args", args)

	commander.parse(args)

	let params: any = commander.args[0] // string|string[]

	global.system.verbosity = commander["verbose"] || 0



	global.settings.pathConfig = commander["config"]
	// global.settings.debug_file=_path.join(global.settings.pathConfig,`debug_${formatDateTime(new Date())}.log`)
	global.settings.pathDB = _path.join(global.settings.pathConfig, "broadcasters.txt")
	global.settings.pathDownload = commander["dl"] || "."
	global.settings.noDownload = commander["nodl"]
	global.settings.pathMove = commander["mv"] || null
	global.settings.parallelDownloads = commander["limit"] || 5
	global.settings.videoFormat = commander["fmt"]
	global.settings.useFFMPEG = commander["ffmpeg"] || null
	global.settings.locale = commander["locale"].toLowerCase()
	global.settings.timeout = commander["timer"]
	global.settings.thumbnail = commander["thumb"]
	global.settings.json = commander["json"]
	global.settings.snapchat = commander["snapchat"]
	global.settings.periscope = commander["periscope"]
	global.settings.vk = commander["vk"]

	global.settings.filenameTemplate=commander["filename"]

	if (!(global.settings.snapchat || global.settings.periscope || global.settings.vk)) {
		global.settings.younow = true
	}

	if (!await dos.exists(global.settings.pathConfig)) {

		await dos.createDirectory(global.settings.pathConfig)
	}

	if (global.settings.pathMove) {
		if (!await dos.exists(global.settings.pathMove)) {
			await dos.createDirectory(global.settings.pathMove)
		}
	}

	if (!await dos.exists(global.settings.pathDownload)) {
		await dos.createDirectory(global.settings.pathDownload)
	}

	if (!global.settings.useFFMPEG) {
		switch (global.settings.videoFormat.toLowerCase()) {
			case "mp4":
			case "flv":
				/** fix for mp4 & flv*/
				global.settings.useFFMPEG = FFMPEG_DEFAULT + " -bsf:a aac_adtstoasc"
				break

			case "mkv":
			case "ts":
				global.settings.useFFMPEG = FFMPEG_DEFAULT
				break

			default:
				error(`Video format ${global.settings.videoFormat} not supported`)
		}
	}

	info(prettify(global.settings))

	if (global.settings.production) {
		checkUpdate()
	}
	else {
		error("dev mode detected")
	}

	/*

		check for ffmpeg

	*/

	let isFFMPEG = _child.spawn("ffmpeg", ["-version"])

	isFFMPEG.on("error", err => {
		error(`ffmpeg is missing !!! You MUST install it before using Younow-Tools.`)
		error(`On windows go to https://ffmpeg.zeranoe.com/builds/ and install it and make it available in path`)
		error(err)
		process.exit(-1)
	})

	switch (commandId) {
		case CommandID.scan:
			cmdScan(params)
			break

		case CommandID.search:
			cmdSearch(params)
			break

		case CommandID.resolve:
			cmdResolve(params)
			break

		case CommandID.annotation:
			cmdAnnotation(params, commander.args[1] || "---")
			break

		case CommandID.vcr:
			cmdVCR(global.settings, params)
			break

		case CommandID.follow:
			require("./cmd_follow").cmdFollow(params)
			break

		case CommandID.followed:
			require("./cmdFollowed").cmdFollowed(params)
			break

		case CommandID.live:
			cmdLive(global.settings, params)
			break

		case CommandID.broadcast:
			cmdBroadcast(params)
			break

		case CommandID.api:
			cmdAPI(global.settings, params)
			break

		case CommandID.fixdb:

			/**
			 *
			 * compact & normalize db
			 *
			 */

			_younow.openDB()
				.then((db) => {
					_fs.rename(global.settings.pathDB, global.settings.pathDB + ".tmp", err => {
						if (err) {
							error(err)
						}
						else {
							for (let user in db) {
								if (!isNaN(user)) {
									db[user] = _younow.convertToUserDB(user as any, db[user] as any)
								}
							}
						}
					})
				})
				.catch(error)

			break

		case CommandID.remove:
			cmdRemove(params)
			break

		case CommandID.add:
			cmdAdd(params)
			break

		case CommandID.ignore:
			cmdIgnore(params)
			break

		case CommandID.debug:
			//log(pkg)
			//log(commander)
			require("./cmd_debug").cmdDebug(global.settings, params)
			break

		default:
			log(`
	Younow-tools version ${global.settings.version}

	As an open source project use it at your own risk. Younow can break it down at any time.

	Report any bug or missing feature at your will.

	If you like this software, please consider a Ƀitcoin donation to 14bpqrNgreKaFtLaK85ArtcUKyAxuKpwJM`)

			commander.help()
	}
}

main(process.argv)
