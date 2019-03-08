import { log, error, prettify } from "./modules/module_log"

import * as _async from "async"
import { getURL, req, download } from "./modules/module_www"
import { hls } from "./modules/module_hls"
import { cleanFilename } from "./modules/module_utils"
import * as dos from "./modules/module_promixified"
import * as fs from "fs"
import * as _path from "path"

import * as _younow from "./modules/module_younow"
import * as periscope from "./modules/module_periscope"
import * as _vk from "./modules/module_vk"

export function cmdLive(settings: Settings, users: string[]) {

	if (settings.younow) {
		_younow.openDB()
			.then((db: DB) => {
				_async.eachSeries(users, function(user, cbAsync) {
					user = _younow.extractUser(user)

					let p = isNaN(user) ? _younow.getLiveBroadcastByUsername(user) : _younow.getLiveBroadcastByUID(user)

					p.then(live => {
						if (live.errorCode) {
							error(`${user} ${live.errorCode} ${live.errorMsg}`)
						}
						else if (live.state != "onBroadcastPlay") {
							error(`${live.state} ${live.stateCopy}`)
						}
						else {
							_younow.downloadThemAll(live)
								.then(result => {
									log(`${live.profile} broadcast is over`)
									return true
								}, error)
						}
					}, error)
						.then(() => {
							cbAsync()
						})
				})
			})
			.catch(error)
	}
	else if (settings.vk) {
		_async.eachSeries(users, (user: string, cb) => {

			// user == url:string as https://vk.com/video_ext.php?oid=${broadcastId}&id=${userId}&hash=${wtf}

			log("try to resolve", user)

			getURL(user, null)
				.then(async body => {

					let broadcast=await _vk.getBroadcast(user)

					let basename=_vk.CreateFilename(broadcast)+"."

					if (broadcast.mp4 || broadcast.postlive_mp4) {

						// archived live
						log("download archived live", user)

						await download(broadcast.mp4 || broadcast.postlive_mp4, basename + "mp4")
					}
					else if (broadcast.hls) {

						// live stream

						log("download live", user)

						//@todo

						let playlist = broadcast.hls.split("?extra=")[0]

						if (settings.thumbnail) {

							await download(broadcast.jpg, basename + "jpg")
						}

						if (settings.json) {
							dos.writeFile(basename + "json", JSON.stringify(broadcast, null, "\t")).catch(error)
						}

						hls(playlist, basename + settings.videoFormat, settings.useFFMPEG, 0, true, cb)
					}
				})
				.catch(error)
		})

	}
	else if (settings.periscope) {
		_async.eachSeries(users, (user: string, cb) => {
			/*
				bid
			or
				https://www.pscp.tv/username/bid
			or
				https://www.pscp.tv/w/bid

			*/

			log("try to resolve", user)

			let pos = user.lastIndexOf("/")

			periscope.getBroadcast(user.substring(pos + 1))
				.then(video => {

					log("download", video.broadcast.user_display_name, video.broadcast.status)

					let basename =periscope.createFilename(video.broadcast)

					if (settings.thumbnail) {
						periscope.downloadThumbnail(basename+".jpg",video.broadcast).catch(error)
					}
					if (settings.json) {
						dos.writeFile(basename + ".json", JSON.stringify(video, null, "\t")).catch(error)
					}

					return periscope.downloadVideo(basename + "." + settings.videoFormat, video)
				})
				.catch(error)
		})
	}
	else {
		error("Not Implemented")
	}
}
