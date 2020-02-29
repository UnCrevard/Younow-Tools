"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dos = require("./module_promixified");
const module_log_1 = require("./module_log");
const fs = require("fs");
class FakeDB {
    constructor() {
        this.db = {
            self: this
        };
        this.proxy = null;
    }
    open(filename, title) {
        this.filename = filename;
        this.title = title;
        return dos.exists(filename)
            .then(exists => {
            if (exists) {
                return dos.readFile(filename)
                    .then(data => {
                    this.parse(this.db, data.toString().split("\n"));
                    this.proxy = this.proxify(this.db);
                    return this.proxy;
                });
            }
            else {
                return dos.appendFile(filename, `# ${title}\n`)
                    .then(err => {
                    this.proxy = this.proxify(this.db);
                    return this.proxy;
                });
            }
        });
    }
    update() {
        dos.readFile(this.filename)
            .then((data) => {
            this.parse(this.db, data.toString().split("\n"));
            module_log_1.info(`DB broadcasters ${Object.keys(this.db).length}`);
        })
            .catch(module_log_1.error);
    }
    proxify(obj) {
        return new Proxy(obj, {
            deleteProperty(target, key) {
                if (key in target) {
                    fs.appendFile(target.self.filename, `-${key}\n`, err => err);
                    return delete target[key];
                }
                else {
                    return true;
                }
            },
            set(target, key, value, recv) {
                fs.appendFile(target.self.filename, `+${key}:${JSON.stringify(value)}\n`, err => err);
                return target[key] = value;
            }
        });
    }
    parse(db, lines) {
        for (let line of lines) {
            let m = line.match(/([+-@])(.+?)\:(.*)/);
            if (m) {
                switch (m[1]) {
                    case "@":
                        if (!db[m[2]]) {
                            db[m[2]] = [];
                        }
                        db[m[2]].push(JSON.parse(m[3]));
                        break;
                    case "+":
                        db[m[2]] = JSON.parse(m[3]);
                        break;
                    case "-":
                        if (m[2] in db) {
                            delete db[m[2]];
                        }
                        break;
                }
            }
        }
    }
}
exports.FakeDB = FakeDB;
//# sourceMappingURL=module_db.js.map