import * as dos from "./module_promixified"
import { log, info, debug, error } from "./module_log"
import * as fs from "fs"

export class FakeDB {
	private filename
	private title
	private db: any =
		{
			self: this
		}
	private proxy = null

	/**
	 * Returns a proxified ref to this
	 * @param  {string}       filename [description]
	 * @param  {string}       title    [description]
	 * @return {Promise<any>}          [description]
	 */
	open(filename: string, title: string): Promise<any> {
		this.filename = filename
		this.title = title

		return dos.exists(filename)
			.then(exists => {
				if (exists) {
					return dos.readFile(filename)
						.then(data => {
							this.parse(this.db, data.toString().split("\n"))
							this.proxy = this.proxify(this.db)
							return this.proxy
						})
				}
				else {
					return dos.appendFile(filename, `# ${title}\n`)
						.then(err => {
							this.proxy = this.proxify(this.db)
							return this.proxy
						})
				}
			})
	}

	update() {
		dos.readFile(this.filename)
			.then((data: Buffer) => {
				this.parse(this.db, data.toString().split("\n"))
				info(`DB broadcasters ${Object.keys(this.db).length}`)
			})
			.catch(error)
	}

	/** @todo ugly */

	proxify(obj) {
		return new Proxy(obj,
			{
				deleteProperty(target, key) {
					if (key in target) {
						fs.appendFile(target.self.filename, `-${key}\n`, err => err)
						return delete target[key]
					}
					else {
						return true
					}
				},
				set(target, key, value, recv) {
					fs.appendFile(target.self.filename, `+${key}:${JSON.stringify(value)}\n`, err => err)
					return target[key] = value
				}
			})
	}

	/**
	 *
	 * @function parse db
	 *
	 * @return Object
	 *
	 */
	parse(db, lines: string[]) {
		for (let line of lines) {
			let m = line.match(/([+-@])(\w+):*(.*)/)

			if (m) {
				switch (m[1]) {
					case "@":
						if (!db[m[2]]) {
							db[m[2]] = []
						}
						db[m[2]].push(JSON.parse(m[3]))
						break

					case "+":
						db[m[2]] = JSON.parse(m[3])
						break;

					case "-":
						if (m[2] in db) {
							delete db[m[2]]
						}
						break;
				}
			}
		}
	}
}
