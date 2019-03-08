import * as _stream from "stream"
import * as _fs from "fs"
import * as _cp from "child_process"

import {log,error,debug} from "./modules/module_log"
import {noop} from "./modules/module_utils"

const FFMPEG_DEFAULT="-loglevel error -c copy -y"

export function convertExtToFormat(ext:string):string
{
	switch(ext.toLowerCase())
	{
		case "mkv":
		return "matroska"

		case "ts":
		return "mpegts"

		case "mp4":
		return "mp4"

		default:
			return null
	}
}

export function ffmpeg(inpfile:string,outfile:string,options:string):Promise<boolean>
{
	return new Promise(resolve=>
	{
		let args=["-y","-i",inpfile,...options.split(" "),outfile]

		let ffmpeg=_cp.spawn("ffmpeg",args)

		ffmpeg.stderr.pipe(process.stdout)

		ffmpeg.on("error",err=>
		{
			error(err)
			resolve(false)
		})

		ffmpeg.on("exit",code=>
		{
			resolve(code==0)
		})
	})
}

export class FFMPEG extends _stream.Writable
{
	private ffmpeg:_cp.ChildProcess

	constructor(inpfile:string,outfile:string)
	{
		super()

		let args=[]

		args.push("-i")
		args.push(inpfile)
		args=args.concat(FFMPEG_DEFAULT.split(" "))
		args.push(outfile)

		this.ffmpeg=_cp.spawn("ffmpeg",args)

		this.ffmpeg.stderr.pipe(process.stdout)

		this.ffmpeg.on("error",err=>
		{
			// spawn ENOENT
			log("ffmpeg.error",err.message)
			this.emit("exit",-1)
		})

		this.ffmpeg.on("exit",code=>
		{
			this.emit("exit",code)
		})

		// ignore Cannot call write after a stream was destroyed
		this.ffmpeg.stdin.on("error",noop)
		this.on("error",noop)
	}

	_write(chunk:Buffer,encoding,callback)
	{
		this.ffmpeg.stdin.write(chunk,callback)
	}

	_final(callback)
	{
		this.ffmpeg.stdin.end(callback)
	}
}
