import * as younow from "./modules/module_younow"
import { log, info, error, prettify } from "./modules/module_log"
import { getURL } from "./modules/module_www"

interface LiveBroadcasters {
	[index: number]:
	{
		status: number
	}
}

export async function cmdFollow(users: string[]) {
	let db: DB = await younow.openDB()

	Promise.all(users.map(user => {
		return younow.resolveUser(db, younow.extractUser(user))
			.then(dbuser => {
				if (dbuser.errorCode) {
					throw `${user} ${dbuser.errorCode} ${dbuser.errorMsg}`
				}

				return dbuser
			})
	}))
		.then((curators: Array<DBUser>) => {
			let liveBroadcasters: LiveBroadcasters = {}

			async function monitor() {
				Promise.all(curators.map(curator => {
					return younow.getOnlineFollowed(curator.userId)
				}))
					.then((curatorsFollowed: Younow.FollowedOnline[]) => {
						let old = liveBroadcasters

						liveBroadcasters = {}

						for (let curatorFollowed of curatorsFollowed) {
							if (curatorFollowed) {
								for (let followed of curatorFollowed.users) {
									let userId = followed.userId

									if (userId in old) {
										liveBroadcasters[userId] = old[userId]
									}
									else {
										liveBroadcasters[userId] = { status: null }
									}

									let broadcaster = liveBroadcasters[userId]

									if (userId in db && db[userId].ignore) {
										if (broadcaster.status == null) {
											info(`${followed.profile} is ignored`)
										}
										broadcaster.status = followed.status
									}
									else {
										if (followed.status != broadcaster.status) {
											broadcaster.status = followed.status

											switch (followed.status) {
												case Younow.FollowedStatus.watching:

													log(`${followed.profile} is watching ${followed.channelName}`)
													break

												case Younow.FollowedStatus.broadcasting:
													younow.getLiveBroadcastByUID(userId)
														.then(live => {

															log(`${live.profile} is broadcasting ${live.broadcastId} ${younow.errortoString(live)}`)

															if (live.errorCode || live.lastSegmentId == undefined) {
																// retry if not ready
																broadcaster.status = null
																info(`${live.profile} is not ready`)
															}
															else {
																return younow.downloadThemAll(live)
																	.then(([thumb, video, json]) => {
																		log(`${followed.profile} is over json : ${thumb} image : ${video} video :${json}`)
																	})
															}
														})
														.catch(error)
													break

												default:
													error(`Status:${followed.status}`)
											}
										}
									}
								}
							}
						}
					})
					.catch(error)
			}

			setInterval(monitor, global.settings.timeout * Utils.Time.MINUTE)
			monitor()
		})
		.catch(error)
}
