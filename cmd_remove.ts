import { settings } from "./main"
import * as younow from "./module_younow"
import { log, info, error } from "./modules/module_log"
import * as _async from "async"

export function cmdRemove(users: string[]) {
	younow.openDB()
		.then(db => {
			_async.eachSeries(users, function(user: string, callback) {
				user = younow.extractUser(user)

				let dbuser = younow.isUsernameInDB(db, user)

				if (dbuser) {
					log(`${user} removed from the db`)
					delete db[dbuser.userId]
				}
				else {
					error(`${user} is not in the db`)
					callback()
				}
			})
		})
		.catch(error)
}
