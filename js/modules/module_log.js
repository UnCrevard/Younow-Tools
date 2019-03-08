"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Verbosity;
(function (Verbosity) {
    Verbosity[Verbosity["log"] = 0] = "log";
    Verbosity[Verbosity["info"] = 1] = "info";
    Verbosity[Verbosity["debug"] = 2] = "debug";
    Verbosity[Verbosity["dump"] = 3] = "dump";
})(Verbosity || (Verbosity = {}));
exports.assert = console.assert;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX2xvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZHVsZXMvbW9kdWxlX2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUssU0FLSjtBQUxELFdBQUssU0FBUztJQUNiLHVDQUFHLENBQUE7SUFDSCx5Q0FBSSxDQUFBO0lBQ0osMkNBQUssQ0FBQTtJQUNMLHlDQUFJLENBQUE7QUFDTCxDQUFDLEVBTEksU0FBUyxLQUFULFNBQVMsUUFLYjtBQUVZLFFBQUEsTUFBTSxHQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUE7QUFFckIsUUFBQSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQTtBQUc5QixjQUFxQixHQUFHLElBQUk7SUFDM0IsSUFBSSxNQUFNLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUU7UUFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQTtLQUN6RDtBQUNGLENBQUM7QUFKRCxvQkFJQztBQUVELGVBQXNCLEdBQUcsSUFBSTtJQUM1QixJQUFJLE1BQU0sQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUN4QyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFlBQVksQ0FBQyxDQUFBO0tBQ3pEO0FBQ0YsQ0FBQztBQUpELHNCQUlDO0FBRUQsZUFBc0IsR0FBRyxJQUFJO0lBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsWUFBWSxDQUFDLENBQUE7SUFDekQsT0FBTyxJQUFJLENBQUE7QUFDWixDQUFDO0FBSEQsc0JBR0M7QUFFRCxjQUFxQixDQUFDO0lBQ3JCLElBQUksTUFBTSxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFO1FBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO0tBQ3BCO0FBQ0YsQ0FBQztBQUpELG9CQUlDO0FBRUQsa0JBQXlCLEdBQUc7SUFDM0IsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUNoRSxDQUFDO0FBRkQsNEJBRUMifQ==