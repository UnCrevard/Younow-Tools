import { getURL, download } from "./module_www"
import { log, error } from "./module_log"
import { hls } from "./module_hls"
import { cleanFilename, formatDateTime, Time } from "./module_utils"

// user == url:string as https://vk.com/video_ext.php?oid=${broadcastId}&id=${userId}&hash=${wtf}
//
export function getBroadcast(url: string): Promise<VK.Broadcast> {
	return getURL(url, null)
		.then(body => {

			let m = body.toString().match(/playerParams.=.(.+?);\n/)

			if (!m) throw "no playerParams"

			let json: VK.VarParams = JSON.parse(m[1])

			return json.params[0]
		})
}

export function downloadBroadcast(basename: string, broadcast: VK.Broadcast) {

	if (broadcast.mp4 || broadcast.postlive_mp4) {
		return download(broadcast.mp4 || broadcast.postlive_mp4, basename + ".mp4")
	}
	else if (broadcast.hls) {
		return new Promise((resolve, reject) => {
			hls(broadcast.hls, basename + ".ts", global.settings.useFFMPEG, 0, true, resolve)
		})
	}
	else {
		throw "no hls stream"
	}
}

export function CreateFilename(broadcast: VK.Broadcast): string {
	return cleanFilename(global.settings.filenameTemplate
		.replace("%country", "XX")
		.replace("%username", broadcast.md_author)
		.replace("%title", broadcast.md_title)
		.replace("%date", formatDateTime(new Date(broadcast.date * Time.MILLI)))
		.replace("%id", broadcast.vid.toString())
		.replace("%service", "vk")
		.replace(/%\w+/, "")).replace(/[^\x20-\xFF]/g, "");
}
