
global.verbosity = 0

const pkg: Package = require("../package.json")

export let settings: Settings =
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
		production: ("_from" in pkg)
	}

import * as _fs from "fs"
import * as _path from "path"
import * as _child from "child_process"
import * as commander from "commander"
import * as _async from "async"
import * as _younow from "./module_younow"
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

import { checkUpdate } from "./module_update"

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
	commander
		.version(settings.version)
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

	commander
		.command("follow <users...>")
		.description("record/monitor broadcasts followed (aka FanOf on profile page) from any user(s) or your account.")
		.action((user, cmd) => commandId = CommandID.follow)

	commander
		.command("add <users...>")
		.description("add user(s) by username, uid, URL to db")
		.action((users, cmd) => commandId = CommandID.add)

	commander
		.command("remove <users...>")
		.alias("rm")
		.description("remove users(s) by username, uid, URL from db")
		.action((users, cmd) => commandId = CommandID.remove)

	commander
		.command("ignore <users...>")
		.description("ignore/unignore users(s) by username, uid, URL from db")
		.action((users, cmd) => commandId = CommandID.ignore)

	commander
		.command(`note <user> [text]`)
		.description(`add a "note" (quoted) to a user in db`)
		.action((users, cmd) => commandId = CommandID.annotation)

	commander
		.command("search <patterns...>")
		.description("search in db for matching pattern(s)")
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
		.description("download archived broadcast if available")
		.action((users, cmd) => commandId = CommandID.vcr)

	commander
		.command("live <users...>")
		.description("download live broadcast from the beginning")
		.action((users, cmd) => commandId = CommandID.live)

	commander
		.command("broadcast <broadcastId...>")
		.description("download broadcastId ")
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
		.description("normalize db informations (advanced)")
		.action((users, cmd) => commandId = CommandID.fixdb)

	commander
		.command("debug [params...]")
		.description("debug tool ignore this")
		.action(() => commandId = CommandID.debug)

	let commandId = -1
	commander.parse(args)
	let params: any = commander.args[0] // string|string[]

	//setVerbose(commander["verbose"] || 0)

	global.verbosity = commander["verbose"] || 0

	settings.pathConfig = commander["config"]
	// settings.debug_file=_path.join(settings.pathConfig,`debug_${formatDateTime(new Date())}.log`)
	settings.pathDB = _path.join(settings.pathConfig, "broadcasters.txt")
	settings.pathDownload = commander["dl"] || "."
	settings.noDownload = commander["nodl"]
	settings.pathMove = commander["mv"] || null
	settings.parallelDownloads = commander["limit"] || 5
	settings.videoFormat = commander["fmt"]
	settings.useFFMPEG = settings.FFMPEG_DEFAULT
	settings.locale = commander["locale"].toLowerCase()
	settings.timeout = commander["timer"]

	if (!await dos.exists(settings.pathConfig)) {

		await dos.createDirectory(settings.pathConfig)
	}

	if (settings.pathMove) {
		if (!await dos.exists(settings.pathMove)) {
			await dos.createDirectory(settings.pathMove)
		}
	}

	if (!await dos.exists(settings.pathDownload)) {
		await dos.createDirectory(settings.pathDownload)
	}

	if (settings.videoFormat.toLowerCase() != "ts") {
		if (!settings.useFFMPEG) {
			switch (settings.videoFormat.toLowerCase()) {
				case "mp4":
					/** fix for mp4 */
					settings.useFFMPEG = settings.FFMPEG_DEFAULT + " -bsf:a aac_adtstoasc"
					break

				case "mkv":
					settings.useFFMPEG = settings.FFMPEG_DEFAULT
					break

				default:
					error(`Video format ${settings.videoFormat} not supported`)
			}
		}
	}

	info(prettify(settings))

	if (settings.production) {
		setTimeout(checkUpdate, 30 * Time.SECOND)
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
			cmdVCR(params)
			break

		case CommandID.follow:
			require("./cmd_follow").cmdFollow(params)
			break

		case CommandID.followed:
			require("./cmdFollowed").cmdFollowed(params)
			break

		case CommandID.live:
			cmdLive(params)
			break

		case CommandID.broadcast:
			cmdBroadcast(params)
			break

		case CommandID.api:
			cmdAPI()
			break

		case CommandID.fixdb:

			/**
			 *
			 * compact & normalize db
			 *
			 */

			_younow.openDB()
				.then((db) => {
					_fs.rename(settings.pathDB, settings.pathDB + ".tmp", err => {
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
			require("./cmd_debug").cmdDebug(params)
			break

		default:
			log(`
	Younow-tools version ${settings.version}

	As an open source project use it at your own risk. Younow can break it down at any time.

	Report any bug or missing feature at your will.

	If you like this software, please consider a Ƀitcoin donation to 14bpqrNgreKaFtLaK85ArtcUKyAxuKpwJM`)

			commander.help()
	}
}

main(process.argv)
