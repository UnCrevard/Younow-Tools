"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Verbosity;
(function (Verbosity) {
    Verbosity[Verbosity["log"] = 0] = "log";
    Verbosity[Verbosity["info"] = 1] = "info";
    Verbosity[Verbosity["debug"] = 2] = "debug";
    Verbosity[Verbosity["dump"] = 3] = "dump";
})(Verbosity || (Verbosity = {}));
exports.log = console.log;
function info(...args) {
    if (global.verbosity >= Verbosity.info) {
        console.log("\u001b[94m" + args.join(" ") + "\u001b[39m");
    }
}
exports.info = info;
function debug(...args) {
    if (global.verbosity >= Verbosity.debug) {
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
    if (global.verbosity >= Verbosity.dump) {
        console.log("%o", o);
    }
}
exports.dump = dump;
function prettify(obj) {
    return JSON.stringify(obj, null, "\t").replace(/,|{|}|\"/g, "");
}
exports.prettify = prettify;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX2xvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZHVsZXMvbW9kdWxlX2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUssU0FLSjtBQUxELFdBQUssU0FBUztJQUNiLHVDQUFHLENBQUE7SUFDSCx5Q0FBSSxDQUFBO0lBQ0osMkNBQUssQ0FBQTtJQUNMLHlDQUFJLENBQUE7QUFDTCxDQUFDLEVBTEksU0FBUyxLQUFULFNBQVMsUUFLYjtBQUVZLFFBQUEsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUE7QUFHOUIsY0FBcUIsR0FBRyxJQUFJO0lBQzNCLElBQUksTUFBTSxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFO1FBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsWUFBWSxDQUFDLENBQUE7S0FDekQ7QUFDRixDQUFDO0FBSkQsb0JBSUM7QUFFRCxlQUFzQixHQUFHLElBQUk7SUFDNUIsSUFBSSxNQUFNLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDeEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQTtLQUN6RDtBQUNGLENBQUM7QUFKRCxzQkFJQztBQUVELGVBQXNCLEdBQUcsSUFBSTtJQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFlBQVksQ0FBQyxDQUFBO0lBQ3pELE9BQU8sSUFBSSxDQUFBO0FBQ1osQ0FBQztBQUhELHNCQUdDO0FBRUQsY0FBcUIsQ0FBQztJQUNyQixJQUFJLE1BQU0sQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLElBQUksRUFBRTtRQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTtLQUNwQjtBQUNGLENBQUM7QUFKRCxvQkFJQztBQUVELGtCQUF5QixHQUFHO0lBQzNCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDaEUsQ0FBQztBQUZELDRCQUVDIn0=