"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_log_1 = require("./module_log");
var Time;
(function (Time) {
    Time[Time["MILLI"] = 1000] = "MILLI";
    Time[Time["SECOND"] = 1000] = "SECOND";
    Time[Time["MINUTE"] = 60000] = "MINUTE";
    Time[Time["HOUR"] = 3600000] = "HOUR";
})(Time = exports.Time || (exports.Time = {}));
function formatDate(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return '' + y + '.' + (m < 10 ? '0' + m : m) + '.' + (d < 10 ? '0' + d : d);
}
exports.formatDate = formatDate;
function formatTime(date) {
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    return `${(h < 10 ? "0" + h : h)}-${(m < 10 ? "0" + m : m)}-${(s < 10 ? "0" + s : s)}`;
}
exports.formatTime = formatTime;
function formatDateTime(date) {
    return formatDate(date) + "_" + formatTime(date);
}
exports.formatDateTime = formatDateTime;
function cleanFilename(filename) {
    return filename.replace(/[\x00-\x1f"<>|*?:/\\]/gi, "_");
}
exports.cleanFilename = cleanFilename;
function cleanHTML(html) {
    return html.replace(/&#(\d+);/g, (x, y) => String.fromCharCode(y));
}
exports.cleanHTML = cleanHTML;
function getFirefoxUserAgent() {
    let date = new Date();
    let version = ((date.getFullYear() - 2018) * 4 + Math.floor(date.getMonth() / 4) + 58) + ".0";
    return `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:${version} Gecko/20100101 Firefox/${version}`;
}
exports.getFirefoxUserAgent = getFirefoxUserAgent;
function noop() { }
exports.noop = noop;
function promisify(func) {
    return new Promise(func);
}
exports.promisify = promisify;
function cbError(err) {
    if (err)
        module_log_1.error(err.stack || err.message || err);
}
exports.cbError = cbError;
//# sourceMappingURL=module_utils.js.map