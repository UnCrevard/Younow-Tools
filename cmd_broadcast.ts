import { log, error } from "./modules/module_log"
import * as _younow from "./modules/module_younow"
import * as _async from "async"

export function cmdBroadcast(bids: string[]) {
	_younow.openDB()
		.then((db: DB) => {
			_async.eachSeries(bids, function(bid: any, cbAsync) {
				if (bid < 107942269) {
					// Before HLS

					error(`${bid} 263 Replay no longer exists`)
					cbAsync()
				}
				else {
					_younow.getArchivedBroadcast(bid)
						.then(archive => {
							if (archive.errorCode) {
								error(`${bid} ${archive.errorCode} ${archive.errorMsg}`)
							}
							else {
								return _younow.resolveUser(db, archive.userId)
									.then(user => {
										if (user.errorCode) {
											error(`${bid} ${user.errorCode} ${user.errorMsg}`)
										}
										else {
											/** @todo created ? */

											return _younow.downloadArchive(user, bid as any, 0)
										}
									})
							}
						})
						.catch(error)
						.then(() => {
							cbAsync()
						})
				}
			})
		})
		.catch(error)
}
