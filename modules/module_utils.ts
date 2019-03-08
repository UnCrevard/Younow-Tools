import * as _fs from "fs"
import * as _path from "path"
import {error} from "./module_log"

/* date & time */

export enum Time {
	MILLI = 1000,
	SECOND = 1000,
	MINUTE = 60000,
	HOUR = 60000 * 60
}

export function formatDate(date: Date): string {
	var d = date.getDate();
	var m = date.getMonth() + 1;
	var y = date.getFullYear();
	return '' + y + '.' + (m < 10 ? '0' + m : m) + '.' + (d < 10 ? '0' + d : d);
}

export function formatTime(date: Date): string {
	var h = date.getHours()
	var m = date.getMinutes()
	var s = date.getSeconds()

	return `${(h < 10 ? "0" + h : h)}-${(m < 10 ? "0" + m : m)}-${(s < 10 ? "0" + s : s)}`
}

export function formatDateTime(date: Date): string {
	return formatDate(date) + "_" + formatTime(date)
}

/* filename */

// windows & Linux

export function cleanFilename(filename: string): string {
	return filename.replace(/[\x00-\x1f"<>|*?:/\\]/gi, "_")
}

export function cleanHTML(html: string): string {

	return html.replace(/&#(\d+);/g, (x, y) => String.fromCharCode(y))
}

export function getFirefoxUserAgent(): string {
	let date = new Date()
	let version = ((date.getFullYear() - 2018) * 4 + Math.floor(date.getMonth() / 4) + 58) + ".0"
	return `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:${version} Gecko/20100101 Firefox/${version}`
}

export function noop(){}

export function promisify(func: (resolve, reject?) => any) {
	return new Promise(func)
}


export function cbError(err:NodeJS.ErrnoException)
{
	if (err) error(err.stack||err.message||err)
}

