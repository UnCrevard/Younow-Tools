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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX2xvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZHVsZXMvbW9kdWxlX2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQVksU0FLWDtBQUxELFdBQVksU0FBUztJQUNwQix1Q0FBRyxDQUFBO0lBQ0gseUNBQUksQ0FBQTtJQUNKLDJDQUFLLENBQUE7SUFDTCx5Q0FBSSxDQUFBO0FBQ0wsQ0FBQyxFQUxXLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBS3BCO0FBRVksUUFBQSxNQUFNLEdBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQTtBQUVyQixRQUFBLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFBO0FBRzlCLGNBQXFCLEdBQUcsSUFBSTtJQUMzQixJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUU7UUFDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQTtLQUN6RDtBQUNGLENBQUM7QUFKRCxvQkFJQztBQUVELGVBQXNCLEdBQUcsSUFBSTtJQUM1QixJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDL0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQTtLQUN6RDtBQUNGLENBQUM7QUFKRCxzQkFJQztBQUVELGVBQXNCLEdBQUcsSUFBSTtJQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFlBQVksQ0FBQyxDQUFBO0lBQ3pELE9BQU8sSUFBSSxDQUFBO0FBQ1osQ0FBQztBQUhELHNCQUdDO0FBRUQsY0FBcUIsQ0FBQztJQUNyQixJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUU7UUFDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7S0FDcEI7QUFDRixDQUFDO0FBSkQsb0JBSUM7QUFFRCxrQkFBeUIsR0FBRztJQUMzQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQ2hFLENBQUM7QUFGRCw0QkFFQyJ9