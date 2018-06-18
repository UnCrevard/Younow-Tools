enum Verbosity {
	log,	// basic
	info,	// blue filters
	debug,	// green network
	dump	// red json
}

export const log = console.log
//console.log("\u001b[97m" + args.join(" ") + "\u001b[39m")

export function info(...args) {
	if (global.verbosity >= Verbosity.info) {
		console.log("\u001b[94m" + args.join(" ") + "\u001b[39m")
	}
}

export function debug(...args) {
	if (global.verbosity >= Verbosity.debug) {
		console.log("\u001b[92m" + args.join(" ") + "\u001b[39m")
	}
}

export function error(...args) {
	console.log("\u001b[91m" + args.join(" ") + "\u001b[39m")
	return args
}

export function dump(o) {
	if (global.verbosity >= Verbosity.dump) {
		console.log("%o", o)
	}
}

export function prettify(obj): string {
	return JSON.stringify(obj, null, "\t").replace(/,|{|}|\"/g, "")
}
