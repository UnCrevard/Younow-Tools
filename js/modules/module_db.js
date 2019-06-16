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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX2RiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbW9kdWxlcy9tb2R1bGVfZGIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBMkM7QUFDM0MsNkNBQXNEO0FBQ3RELHlCQUF3QjtBQUV4QixNQUFhLE1BQU07SUFBbkI7UUFHUyxPQUFFLEdBQ1Q7WUFDQyxJQUFJLEVBQUUsSUFBSTtTQUNWLENBQUE7UUFDTSxVQUFLLEdBQUcsSUFBSSxDQUFBO0lBK0ZyQixDQUFDO0lBdkZBLElBQUksQ0FBQyxRQUFnQixFQUFFLEtBQWE7UUFDbkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7UUFDeEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7UUFFbEIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQzthQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDZCxJQUFJLE1BQU0sRUFBRTtnQkFDWCxPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO3FCQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ1osSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtvQkFDaEQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtvQkFDbEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBO2dCQUNsQixDQUFDLENBQUMsQ0FBQTthQUNIO2lCQUNJO2dCQUNKLE9BQU8sR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxLQUFLLElBQUksQ0FBQztxQkFDN0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUNYLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8s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