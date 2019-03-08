/// <reference path="../../__typing/periscope.d.ts" />

import * as path from "path"
import * as url from "url"
import { formatDateTime, cleanFilename } from "./module_utils"
import { log, error,prettify } from "./module_log"
import * as promisify from "./module_promixified"
import { hls } from "./module_hls"

import { getURL, download } from "./module_www"

export const PERISCOPE_URL = "www.pscp.tv"
export const API = "https://proxsee.pscp.tv/api/v2/"

export function getBroadcast(bid): Promise<Periscope.VideoPublic> {
	// @FIX:error
	return getURL(`${API}accessVideoPublic?broadcast_id=${bid}`)
}

export function createFilename(broadcast: Periscope.Broadcast) {

	return path.join(global.settings.pathDownload,cleanFilename(global.settings.filenameTemplate
		.replace("service","Periscope")
		.replace("country", broadcast.iso_code||broadcast.language||"XX")
		.replace("username", broadcast.username)
		.replace("title", broadcast.status)
		.replace("date", formatDateTime(new Date(broadcast.created_at)))
		.replace("bid", broadcast.id)
		.replace("type",broadcast.state=="ENDED"?"replay":"live")
		))
}

export function downloadVideo(filename: string, video: Periscope.VideoPublic) {

	if (!video.replay_url && !video.https_hls_url)
	{
		error(prettify(video))
	}

	if (video.replay_url) {

		return new Promise(resolve => {
			hls(video.replay_url, filename, global.settings.useFFMPEG, video.broadcast.camera_rotation, false, resolve)
		})
	}
	else {
		return new Promise(resolve => {
			hls(video.https_hls_url, filename, global.settings.useFFMPEG, video.broadcast.camera_rotation, true, resolve)
		})
	}
}

export async function downloadThumbnail(filename, broadcast: Periscope.Broadcast) {

	if (!broadcast.image_url) return false

	return download(broadcast.image_url, filename)
}

export function downloadProfile(broadcast: Periscope.Broadcast) {
	return getURL(broadcast.profile_image_url, null)
		.then((data: Buffer) => {
			return promisify.writeFile(createFilename(broadcast) + ".png", data)
		})
}

export function parseURL(user: string): String | null {
	let u = url.parse(user)

	/*
	www.pscp.tv

	https://.../username
	https://.../username/broadcast
	https://.../w/broadcast
	 */

	if (u.hostname) {
		if (u.hostname != PERISCOPE_URL) {
			error(url);
			return null
		}
		else {
			return user
		}
	}
	else {
		return `https://${PERISCOPE_URL}/${user}`
	}
}
