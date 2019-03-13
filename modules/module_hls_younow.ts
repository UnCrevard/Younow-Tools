import * as Progress from "progress"
import { log, info, error, debug } from "./module_log"
import { VideoWriter } from "./module_ffmpeg"
import { getURL } from "./module_www"
import { noop } from "./module_utils"

/**
 * download segments for rewind/archive
 * @param {string}        url            [description]
 * @param {string}        video_filename [description]
 * @param {number}        total_segment  [description]
 * @param {Progress|null} bar            [description]
 */
export function downloadSegments(settings: Settings, url: string,
	video_filename: string,
	total_segment: number,
	bar: Progress | null,
	isLive: boolean): Promise<boolean | VideoWriter> {
	let running = 0
	let counter = 0
	let ptr = 0
	let buffers: Array<Buffer> = []
	let stream = new VideoWriter("-",video_filename, settings.useFFMPEG,noop)

	return new Promise(resolve => {
		function downloadSegment() {
			while (running < settings.parallelDownloads && counter < total_segment) {
				let segment = counter

				running++
				counter++

				getURL(`${url}${segment}.ts`, null)
					.catch(err => {
						// @todo:retry
						error(`segment ${segment} fail with ${err}`)
						return null
					})
					.then(buffer => {
						if (bar) {
							bar.tick()
						}

						buffers[segment] = buffer

						if (segment == ptr) {
							while (ptr in buffers) {
								stream.write(buffers[ptr], null)
								delete buffers[ptr] // free memory
								ptr++
							}
						}

						running--

						if (counter < total_segment) {
							downloadSegment()
						}
						else if (running == 0) {
							if (isLive) {
								resolve(stream)
							}
							else {
								stream.close(err => {

									debug("downloadSegment stream.close",err)

									resolve(err)
								})
							}
						}
					})
					.catch(err => {
						error(err)
						return false
					})
			}
		}

		downloadSegment()
	})
}
