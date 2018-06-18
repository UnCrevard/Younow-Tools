export const SECOND = 1000;
export const MINUTE = 1000 * 60;
export const HOUR = 1000 * 60 * 60;

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

// windows & Linux

export function cleanFilename(filename: string): string {
	return filename.replace(/[*?:/\\]/gi, "_")
}
