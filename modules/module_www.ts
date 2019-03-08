import * as https from "https"
import * as fs from "fs"
import * as Request from "request"
import { log, debug, error } from "./module_log"

var fix: any = https

fix.globalAgent.keepAlive = true
fix.globalAgent.keepAliveMsecs = 10000
fix.globalAgent.maxSockets = 100

export function getFirefoxUserAgent(): string {
	let date = new Date()
	let version = ((date.getFullYear() - 2018) * 4 + Math.floor(date.getMonth() / 4) + 58) + ".0"
	return `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:${version} Gecko/20100101 Firefox/${version}`
}

export const jar = Request.jar()

const config: Request.CoreOptions = {
	jar: jar,
	followAllRedirects: true,
	headers:
	{
		"user-agent": getFirefoxUserAgent(),
		"Accept-Language": "en-us, en; q=0.5"
		,Accept: "*/*"
	},
	gzip: true,
	encoding: null
}

debug(config)

export const req = Request.defaults(config)

export async function getURL(url, encoding = "json"): Promise<any> {

	debug(url, encoding)

	if (!url) throw "getURL : empty url"

	if (!(encoding === null || encoding === "utf-8" || encoding=="utf8" || encoding === "json")) throw `getURL : bad encoding ${encoding}`

	return new Promise(function(resolve, reject) {

		req.get(url, function(err, res, body: Buffer) {
			if (err) {
				error(`NET ${err} ${url}`)
				reject(err)
			}
			else if (res.statusCode != 200) {
				error(`NET ${res.statusCode} ${url}`)
				reject(res.statusCode)
			}
			else {
				debug(`NET:statusCode:${res.statusCode} Type:${typeof body} Len:${body && body.length} URL:${url}`)

				var data: any

				try {
					switch (encoding) {
						case "json":
							data = JSON.parse(body.toString())
							break

						case null: // binary
							data = body
							break

						default:
							data = body.toString(encoding)
					}

					resolve(data)
				}
				catch (e) {
					error(__filename, `NET:encoding as ${encoding} ${e}`)
					reject(-1)
				}
			}
		})
	})
}

export function post(url, form): Promise<any> {
	return new Promise((resolve, reject) => {
		req.post(url, form, (err, res, body) => {
			if (err) {
				error(`${err} ${url}`)
				reject(err)
			}
			else {
				resolve(body)
			}
		})
	})
}

/**
 * @function download stream to file
 * @param  {string}
 * @param  {string}
 * @return {Promise<any>}
 */
export function download(url: string, filename: string): Promise<any> {
	return new Promise((resolve, reject) => {

		req(url)
			.on("error", err => {
				error("download.req", err)
				reject(err)
			})
			.on("end", err => {
			})
			.pipe(fs.createWriteStream(filename))
			.on("error", err => {
				error("download.pipe", err)
				reject(err)
			})
			.on("finish", resolve)
	})
}
