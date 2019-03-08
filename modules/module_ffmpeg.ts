import * as FS from "fs"
import { spawn, ChildProcess } from "child_process"
import { log, info, error, debug } from "./module_log"
import {noop} from "./module_utils"

export class VideoWriter {

	private stream: FS.WriteStream = null
	private ffmpeg: ChildProcess = null
	private filename: string = null

	constructor(source:string,filename: string, useFFMPEG: string,callback:(result:boolean)=>void) {

		this.filename = filename

		//@ugly

		let params = ["-i", source].concat(useFFMPEG.split(" "))

		params.push(filename)

		info(`FFMPEG : ${params.join(" ")}`)

		this.ffmpeg = spawn("ffmpeg", params)

		this.ffmpeg.on("error", err => {
			error(err)
			callback(false)
		})

		// exit then close

		this.ffmpeg.on("exit", code => {
			info(`FFMPEG exit ${code}`)
		})

		this.ffmpeg.on("close", code => {
			info(`FFMPEG close ${code}`)
			this.ffmpeg = null
			callback(code===0)
		})

		this.ffmpeg.stderr.on("data", noop)

		this.ffmpeg.stdin.on("error", noop)
	}

	close(callback: Function) {
		if (this.ffmpeg) {
			this.ffmpeg.stdin.end()
		}
	}

	write(data: Buffer, callback: Function) {
		if (this.ffmpeg && data) {
			this.ffmpeg.stdin.write(data)
		}
	}
}
