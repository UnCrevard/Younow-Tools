import { settings } from "./main"
import { log, error } from "./modules/module_log"
import * as _younow from "./module_younow"
import * as _async from "async"

export function cmdLive(users: string[]) {
	_younow.openDB()
		.then((db: DB) => {
			_async.eachSeries(users, function(user, cbAsync) {
				user = _younow.extractUser(user)

				let p = isNaN(user) ? _younow.getLiveBroadcastByUsername(user) : _younow.getLiveBroadcastByUID(user)

				p.then(live => {
					if (live.errorCode) {
						error(`${user} ${live.errorCode} ${live.errorMsg}`)
					}
					else if (live.state != "onBroadcastPlay") {
						error(`${live.state} ${live.stateCopy}`)
					}
					else {
						_younow.downloadThemAll(live)
							.then(result => {
								log(`${live.profile} broadcast is over`)
								return true
							}, error)
					}
				}, error)
					.then(() => {
						cbAsync()
					})
			})
		})
		.catch(error)


}
