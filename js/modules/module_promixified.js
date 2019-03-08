"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function exists(filename) {
    return new Promise((resolve, reject) => {
        fs.exists(filename, resolve);
    });
}
exports.exists = exists;
function readFile(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, (err, data) => err ? reject(err) : resolve(data));
    });
}
exports.readFile = readFile;
function writeFile(filename, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, data, err => err ? reject(err) : resolve(err));
    });
}
exports.writeFile = writeFile;
function appendFile(filename, data) {
    return new Promise((resolve, reject) => {
        fs.appendFile(filename, data, err => err ? reject(err) : resolve(err));
    });
}
exports.appendFile = appendFile;
function rename(src, dst) {
    return new Promise((resolve, reject) => {
        fs.rename(src, dst, err => err ? reject(err) : resolve(err));
    });
}
exports.rename = rename;
function moveTo(filename, dstPath) {
    let newpath = path.join(dstPath, filename);
    return rename(filename, newpath);
}
exports.moveTo = moveTo;
function createDirectory(path) {
    return exists(path)
        .then(bool => {
        if (!bool) {
            return new Promise((resolve, reject) => {
                fs.mkdir(path, err => err ? reject(err) : resolve(true));
            });
        }
    });
}
exports.createDirectory = createDirectory;
function setCurrentDirectory(path) {
    return __awaiter(this, void 0, void 0, function* () {
        process.chdir(path);
        return true;
    });
}
exports.setCurrentDirectory = setCurrentDirectory;
function getCurrentDirectory() {
    return __awaiter(this, void 0, void 0, function* () {
        return process.cwd();
    });
}
exports.getCurrentDirectory = getCurrentDirectory;
function stats(filename) {
    return new Promise((resolve, reject) => {
        fs.stat(filename, (err, stats) => {
            err ? reject(err) : resolve(stats);
        });
    });
}
exports.stats = stats;
function timeout(timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, timeout);
    });
}
exports.timeout = timeout;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3Byb21peGlmaWVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbW9kdWxlcy9tb2R1bGVfcHJvbWl4aWZpZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHlCQUF3QjtBQUN4Qiw2QkFBNEI7QUFJNUIsZ0JBQXVCLFFBQWdCO0lBQ3RDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDdEMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDN0IsQ0FBQyxDQUFDLENBQUE7QUFDSCxDQUFDO0FBSkQsd0JBSUM7QUFJRCxrQkFBeUIsUUFBZ0I7SUFDeEMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUN0QyxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtJQUN4RSxDQUFDLENBQUMsQ0FBQTtBQUNILENBQUM7QUFKRCw0QkFJQztBQUlELG1CQUEwQixRQUFnQixFQUFFLElBQXFCO0lBQ2hFLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDdEMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO0lBQ3RFLENBQUMsQ0FBQyxDQUFBO0FBQ0gsQ0FBQztBQUpELDhCQUlDO0FBSUQsb0JBQTJCLFFB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