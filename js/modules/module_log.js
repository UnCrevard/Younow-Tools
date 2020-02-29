"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Verbosity;
(function (Verbosity) {
    Verbosity[Verbosity["log"] = 0] = "log";
    Verbosity[Verbosity["info"] = 1] = "info";
    Verbosity[Verbosity["debug"] = 2] = "debug";
    Verbosity[Verbosity["dump"] = 3] = "dump";
})(Verbosity = exports.Verbosity || (exports.Verbosity = {}));
exports.assert = console.assert;
exports.log = console.log;
function info(...args) {
    if (global.system.verbosity >= Verbosity.info) {
        console.log("\u001b[94m" + args.join(" ") + "\u001b[39m");
    }
}
exports.info = info;
function debug(...args) {
    if (global.system.verbosity >= Verbosity.debug) {
        console.log("\u001b[92m" + args.join(" ") + "\u001b[39m");
    }
}
exports.debug = debug;
function error(...args) {
    console.log("\u001b[91m" + args.join(" ") + "\u001b[39m");
    return args;
}
exports.error = error;
function dump(o) {
    if (global.system.verbosity >= Verbosity.dump) {
        console.log("%o", o);
    }
}
exports.dump = dump;
function prettify(obj) {
    return JSON.stringify(obj, null, "\t").replace(/,|{|}|\"/g, "");
}
exports.prettify = prettify;
//# sourceMappingURL=module_log.js.map