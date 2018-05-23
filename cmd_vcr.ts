import * as _younow from "./module_younow"
import * as _async from "async"
import { log, info, debug, error, prettify } from "./modules/module_log"

export function cmdVCR(users: string[]) {
	_younow.openDB()
		.then(db => {
			_async.eachSeries(users, function(user, callback_users) {
				user = _younow.extractUser(user)

				_younow.resolveUser(db, user)
					.then((userinfo) => {
						if (userinfo.errorCode == 0) {
							let uid = userinfo.userId
							let n = 0
							let downloadableMoments: Array<Younow.Moment> = []

							_async.forever(function(next) {
								_younow.getMoments(uid, n)
									.then((moments) => {
										if (moments.errorCode == 0) {
											for (let moment of moments.items) {
												if (moment.broadcaster.userId == uid) {
													downloadableMoments.push(moment)
												}
											}

											log(`current broadcast extracted ${downloadableMoments.length}`)

											if (moments.hasMore && moments.items.length) // fix
											{
												n = moments.items[moments.items.length - 1].created
												next(false)
											}
											else {
												next(true)
											}
										}
										else {
											throw new Error(`${userinfo.profile} ${userinfo.errorCode} ${userinfo.errorMsg}`)
										}
									})
									.catch(err => {
										error(err)
										next(false)
									})
							}, function(err) {
									if (downloadableMoments.length == 0) {
										callback_users()
									}
									else {
										_async.eachSeries(downloadableMoments.reverse(), function(moment, callback_moments) {
											_younow.downloadArchive(userinfo, moment.broadcastId, moment.created)
												.then(result => {
													callback_moments()
												}, err => {
														error(err)
														return false
													})


										}, callback_users)
									}
								})
						}
						else {
							error(`${user} ${userinfo.errorCode} ${userinfo.errorMsg}`)
						}
					})
					.catch((err) => {
						error(err)
						callback_users()
					})
			})
		})
		.catch(error)
}
