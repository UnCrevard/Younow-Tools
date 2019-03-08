import * as fs from "fs"
import * as path from "path"

/** returns Promise(exists:boolean or err) */

export function exists(filename: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		fs.exists(filename, resolve)
	})
}

/** returns Promise(data or err) */

export function readFile(filename: string) {
	return new Promise((resolve, reject) => {
		fs.readFile(filename, (err, data) => err ? reject(err) : resolve(data))
	})
}

/** returns Promise(null or err) */

export function writeFile(filename: string, data: string | Buffer) {
	return new Promise((resolve, reject) => {
		fs.writeFile(filename, data, err => err ? reject(err) : resolve(err))
	})
}

/** returns Promise(null or err) */

export function appendFile(filename: string, data: string | Buffer) {
	return new Promise((resolve, reject) => {
		fs.appendFile(filename, data, err => err ? reject(err) : resolve(err))
	})
}

/** returns Promise(null or err) */

export function rename(src: string, dst: string): Promise<any> {
	return new Promise((resolve, reject) => {
		fs.rename(src, dst, err => err ? reject(err) : resolve(err))
	})
}

export function moveTo(filename: string, dstPath: string) {

	let newpath = path.join(dstPath, filename)
	return rename(filename, newpath)
}

export function createDirectory(path: string): Promise<any> {
	return exists(path)
		.then(bool => {
			if (!bool) {
				return new Promise((resolve, reject) => {
					fs.mkdir(path, err => err ? reject(err) : resolve(true))
				})
			}
		})
}

export async function setCurrentDirectory(path) {
	process.chdir(path)
	return true
}

export async function getCurrentDirectory() {
	return process.cwd()
}

export function stats(filename:string):Promise<fs.Stats>
{
	return new Promise((resolve,reject)=>
	{
		fs.stat(filename,(err,stats:any)=>
		{
			err?reject(err):resolve(stats)
		})
	})
}
export function timeout(timeout: number) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, timeout)
	})
}
