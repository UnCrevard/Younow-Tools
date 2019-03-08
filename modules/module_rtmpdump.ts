import * as _fs from "fs"
import { spawn, ChildProcess } from "child_process"
import { log, error, debug } from "./module_log"


export function rtmpdump(url: string, filename: string): Promise<boolean> {

	_fs.createWriteStream(filename,{

	})
	return new Promise((resolve, reject) => {

		let params = ["--live","--timeout","120","--rtmp",url,"-o",filename]

		let proc = spawn("rtmpdump", params)

		proc.on("error", err => {
			reject(err)
		})

		// code -> exit -> close

		proc.on("exit", code => {
			debug(`rtmpdump exit ${code}`)
		})

		proc.on("close", code => {
			debug(`rtmpdump close ${code}`)
			resolve(code == 0)
		})

		proc.stdout.on("data", data => {
			// debug("stdout", data.toString())
		})

		proc.stderr.on("data", data => {
		})

		proc.stdin.on("error", error)
	})
}
