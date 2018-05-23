"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Verbosity;
(function (Verbosity) {
    Verbosity[Verbosity["log"] = 0] = "log";
    Verbosity[Verbosity["info"] = 1] = "info";
    Verbosity[Verbosity["debug"] = 2] = "debug";
    Verbosity[Verbosity["dump"] = 3] = "dump";
})(Verbosity || (Verbosity = {}));
exports.verbose = 0;
function setVerbose(level) {
    exports.verbose = level;
}
exports.setVerbose = setVerbose;
exports.log = console.log;
function info(...args) {
    if (exports.verbose >= Verbosity.info) {
        exports.log("\u001b[94m" + args.join(" ") + "\u001b[39m");
    }
}
exports.info = info;
function debug(...args) {
    if (exports.verbose >= Verbosity.debug) {
        exports.log("\u001b[92m" + args.join(" ") + "\u001b[39m");
    }
}
exports.debug = debug;
function dump(o) {
    if (exports.verbose >= Verbosity.dump) {
        exports.log(o);
    }
}
exports.dump = dump;
exports.error = console.error;
function prettify(obj) {
    return JSON.stringify(obj, null, "\t").replace(/,|{|}|\"/g, "");
}
exports.prettify = prettify;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX2xvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZHVsZXMvbW9kdWxlX2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUssU0FLSjtBQUxELFdBQUssU0FBUztJQUNiLHVDQUFHLENBQUE7SUFDSCx5Q0FBSSxDQUFBO0lBQ0osMkNBQUssQ0FBQTtJQUNMLHlDQUFJLENBQUE7QUFDTCxDQUFDLEVBTEksU0FBUyxLQUFULFNBQVMsUUFLYjtBQUVVLFFBQUEsT0FBTyxHQUFHLENBQUMsQ0FBQTtBQUV0QixvQkFBMkIsS0FBYTtJQUN2QyxlQUFPLEdBQUcsS0FBSyxDQUFBO0FBQ2hCLENBQUM7QUFGRCxnQ0FFQztBQUVZLFFBQUEsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUE7QUFFOUIsY0FBcUIsR0FBRyxJQUFJO0lBQzNCLElBQUksZUFBTyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUU7UUFDOUIsV0FBRyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFlBQVksQ0FBQyxDQUFBO0tBQ2pEO0FBQ0YsQ0FBQztBQUpELG9CQUlDO0FBRUQsZUFBc0IsR0FBRyxJQUFJO0lBQzVCLElBQUksZUFBTyxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDL0IsV0FBRyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFlBQVksQ0FBQyxDQUFBO0tBQ2pEO0FBQ0YsQ0FBQztBQUpELHNCQUlDO0FBRUQsY0FBcUIsQ0FBQztJQUNyQixJQUFJLGVBQU8sSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFO1FBQzlCLFdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUNOO0FBQ0YsQ0FBQztBQUpELG9CQUlDO0FBRVksUUFBQSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQTtBQUVsQyxrQkFBeUIsR0FBRztJQUMzQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQ2hFLENBQUM7QUFGRCw0QkFFQyJ9