import * as younow from "./modules/module_younow"
import * as database from "./modules/module_db"
import { log, error } from "./modules/module_log"

export async function cmdFollowed(users: string[]) {
	let db = await younow.openDB()

	users.forEach(async function(user) {
		let userinfo = await younow.resolveUser(db, user)
		let hasNext = 0, start = 0

		do {
			let result: Younow.Followed = await younow.getFollowed(userinfo.userId, start)

			if (result.errorCode) {
				error(younow.errortoString(result))
				break
			}

			if (start == 0) {
				log(`#\n# ${userinfo.userId},${userinfo.profile}\n#`)
			}

			result.fans.forEach(fan => log(`${fan.userId},${fan.profileUrlString},${fan.firstName},${fan.lastName},${fan.description}`.replace(/[\x00-\x1f]/g, " ")))

			start += result.count
			hasNext = result.hasNext
		} while (hasNext);
	})
}
