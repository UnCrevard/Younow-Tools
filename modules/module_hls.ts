import * as fs from "fs"
import { log, info, debug, error } from "./module_log"
import * as ffmpeg from "./module_ffmpeg"
import { exists, writeFile } from "./module_promixified"
import { getURL } from "./module_www"

/**
*
*
*
*/
function openStream(filename, ffmpegParams: string, rotate: number): ffmpeg.VideoWriter {
	rotate = rotate % 360
	rotate = Math.floor(rotate / 45) * 45

	// -video_track_timescale 0

	// @info rotation meta not for .ts

	//  -metadata:s:v:0 rotate=${rotate}

	// -bsf:a aac_adtstoasc

	return new ffmpeg.VideoWriter(filename, ffmpegParams)
}

function writeStream(stream: ffmpeg.VideoWriter, data: Buffer, callback: Function) {
	stream.write(data, callback)
}

function closeStream(stream: ffmpeg.VideoWriter) {
	stream.close(error)
}

/**
 *
 * implementation of the hls protocol
 *
 * @param {string} url to m3u8
 * @param {string} filename
 * @param {number} rotation angle
 * @params {boolean} isLive
 * @param {Function} callback(result:boolean)
 */
export function hls(playlistURL: string, filename: string, ffmpegParams: string, rotate: number, isLive: boolean, callback) {
	let lastSegment = 0
	let timer = 3000
	let root = playlistURL.substr(0, playlistURL.lastIndexOf("/") + 1)
	let chunks = {}
	let cache = []
	let stream = openStream(filename, ffmpegParams, rotate)
	let idle = 0

	function downloadPlaylist() {
		getURL(playlistURL, "utf8")
			.then((playlist: string) => {
				let lines = playlist.split("\n")

				lines.forEach(line => {
					if (line) {
						if (line.charAt(0) == "#") {
							// #EXT-X-MEDIA-SEQUENCE:262

							let m = line.match(/#(.+?):(.+)/)

							if (m) {
								let params: any = m[2]

								switch (m[1]) {
									case "EXT-X-MEDIA-SEQUENCE":
										if (params < lastSegment) {
											//log(params,lastSegment,lines)
										}
										lastSegment = params
										break

									case "EXT-X-TARGETDURATION":
										if (params > 5) {
											//log(lines)
										}
										else {
											//timer=params*1000
										}
										break

									case "EXT-X-PROGRAM-DATE-TIME":
									case "EXT-X-VERSION":
									case "EXTINF":
									case "EXT-X-DISCONTINUITY-SEQUENCE":
										break

									default:
									//log(m[1],m[2])
								}
							}
							else {
								switch (line) {
									case "#EXTM3U":
									case "#EXT-X-INDEPENDENT-SEGMENTS":
										break

									default:
									//log(line)
								}
							}
						}
						else {
							if (line in chunks) {

							}
							else {
								chunks[line] = true

								let url = root + line
								cache.push(url)
							}
						}
					}
				})

				//log(`timer ${timer} segment ${lastSegment} cache ${cache.length}`)

				if (cache.length) {
					idle = 0

					let url = cache.shift()

					getURL(url, null)
						.then((data: Buffer) => {
							writeStream(stream, data, err => {
							})
						})
						.catch(error)
						.then(() => {
							if (!isLive) {
								downloadPlaylist()
							}
							else {
								setTimeout(downloadPlaylist, timer / (cache.length + 1))
							}
						})
				}
				else {
					idle++

					if (idle > 30 || isLive == false) {
						closeStream(stream)
						callback(true)
					}
					else {
						setTimeout(downloadPlaylist, timer)
					}
				}
			})
			.catch(err => {
				error(err)
				closeStream(stream)
				callback(false)
			})
	}

	downloadPlaylist()
}
