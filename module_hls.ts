import * as _fs from "fs"
import { getURL } from "./modules/module_www"
import { log, info,debug, error } from "./modules/module_log"
import { noop, promisify, cbError } from "./modules/module_utils"
import { FFMPEG } from "./module_ffmpeg"

import * as _cp from "child_process"

let currentConnections = 0
/*

	catch : error

*/
export function HLS(url: string,
	outfile: string,
	timeout: number,
	maxParallelDownload: number): Promise<boolean> {

	return new Promise(async resolve => {

		let theEnd = false

		function parsePlaylist(playlist: string, head: string, tail: string): Array<string> {

			if (!playlist) throw "playlist empty"

			let lines = playlist.split("\n")

			if (lines.shift() != "#EXTM3U") throw "playlist invalid"

			let segments = []

			for (let line of lines) {

				if (line.length) {
					if (line.startsWith("#")) {

						let m = line.match(/#(EXT-X-|EXT)([A-Z0-9-]+)(?::(.*))?/)

						if (!m) {
							debug("error", line)
						}
						else {
							switch (m[2]) {

								case "ENDLIST":
									theEnd = true; // Youtube
									break;
								case "M3U":
								case "INF":
								case "VERSION":
								case "MEDIA-SEQUENCE":
								case "TARGETDURATION":
								case "PROGRAM-DATE-TIME":
								case "INDEPENDENT-SEGMENTS":
								case "START":
								case "DISCONTINUITY-SEQUENCE":
								case "DISCONTINUITY":
									break;

								case "DYNAMICALLY-GENERATED": // playlist @todo
									throw "EXT-X-DYNAMICALLY-GENERATED";
								default:
									debug("not supported", line)
							}
						}
					}
					else {
						if (line.match(/.+:\/\/.+/)) {
							segments.push(line)
						}
						else {
							segments.push(head + "/" + line + tail)
						}
					}
				}
			}

			if (segments.length == 0) throw "playlist invalid"

			return segments
		}

		let countSegment = 0
		let segmentSeen: Record<string, boolean> = {}
		let cache: Array<string> = []
		let idle = 0

		let player = false

		if (!url) throw "url is null"

		let m3u8 = url.match(/(.+)\/.+\.m3u8(.+|)/i)

		if (!m3u8) throw "playlist url is invalid"

		let args = []

		args.push("-loglevel")
		args.push("error")
		args.push("-i")
		args.push("-")
		args.push("-c")
		args.push("copy")
		args.push(outfile)

		let ffmpeg = _cp.spawn("ffmpeg", args)

		ffmpeg.on("error", err => {
			error("ffmpeg.error", err.message)
			resolve(false)
		})

		ffmpeg.on("exit", code => {
			info("ffmpeg.exit", code)
			resolve(code === 0)
		})

		ffmpeg.stderr.pipe(process.stdout)

		ffmpeg.stdin.on("error", error)

		while (true) {
			try {
				let text = await getURL(url, "utf-8")
				let segments = parsePlaylist(text, m3u8[1], m3u8[2])

				for (let segment of segments) {
					if (!(segment in segmentSeen)) {
						segmentSeen[segment] = true
						cache.push(segment)
					}
				}

				countSegment += cache.length

				debug("segments", cache.length)

				while (cache.length) {

					idle = 0

					let len = Math.min(cache.length, currentConnections < 50 ? maxParallelDownload : 1)

					let promises = cache.splice(0, len).map(url => {

						return getURL(url, null).catch(err => {
							error(err)
							return null
						})
					})

					currentConnections += promises.length

					let buffers: Array<any> = await Promise.all(promises)

					currentConnections -= promises.length

					if (!ffmpeg.stdin.writable) throw "stream closed"

					for (let buffer of buffers) {
						if (buffer) ffmpeg.stdin.write(buffer)
					}
				}
			}
			catch (err) {
				error("HLS crash", err)
			}

			if (ffmpeg.stdin.writable) ffmpeg.stdin.end()

			return
		}
	})
}
