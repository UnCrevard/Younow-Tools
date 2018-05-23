enum Verbosity {
	log,	// basic
	info,	// blue filters
	debug,	// green network
	dump	// red json
}

export let verbose = 0

export function setVerbose(level: number) {
	verbose = level
}

export const log = console.log

export function info(...args) {
	if (verbose >= Verbosity.info) {
		log("\u001b[94m" + args.join(" ") + "\u001b[39m")
	}
}

export function debug(...args) {
	if (verbose >= Verbosity.debug) {
		log("\u001b[92m" + args.join(" ") + "\u001b[39m")
	}
}

export function dump(o) {
	if (verbose >= Verbosity.dump) {
		log(o)
	}
}

export const error = console.error

export function prettify(obj): string {
	return JSON.stringify(obj, null, "\t").replace(/,|{|}|\"/g, "")
}

