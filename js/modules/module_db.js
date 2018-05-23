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
            let m = line.match(/([+-@])(\w+):*(.*)/);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX2RiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbW9kdWxlcy9tb2R1bGVfZGIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBMkM7QUFDM0MsNkNBQXNEO0FBQ3RELHlCQUF3QjtBQUV4QjtJQUFBO1FBR1MsT0FBRSxHQUNUO1lBQ0MsSUFBSSxFQUFFLElBQUk7U0FDVixDQUFBO1FBQ00sVUFBSyxHQUFHLElBQUksQ0FBQTtJQStGckIsQ0FBQztJQXZGQSxJQUFJLENBQUMsUUFBZ0IsRUFBRSxLQUFhO1FBQ25DLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO1FBQ3hCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO1FBRWxCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7YUFDekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ2QsSUFBSSxNQUFNLEVBQUU7Z0JBQ1gsT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztxQkFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNaLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7b0JBQ2hELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7b0JBQ2xDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQTtnQkFDbEIsQ0FBQyxDQUFDLENBQUE7YUFDSDtpQkFDSTtnQkFDSixPQUFPLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLEtBQUssS0FBSyxJQUFJLENBQUM7cUJBQzdDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDWCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxD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