import * as _younow from "./modules/module_younow"
import * as snapchat from "./modules/module_snapchat"
import * as periscope from "./modules/module_periscope"

import * as _async from "async"
import { log, info, debug, error, prettify } from "./modules/module_log"
import { FakeDB } from "./modules/module_db"


import * as dos from "./modules/module_promixified"
import * as path from "path"
import { cleanFilename, formatDateTime, Time } from "./modules/module_utils"
import { getURL, req, download } from "./modules/module_www"

export async function cmdVCR(settings: Settings, users: string[]) {

	if (settings.younow) {
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



													if (moment.broadcaster.userId) {
														info(moment.broadcaster.name,moment.broadcastId,formatDateTime(new Date(moment.created*1000)));
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

										// download broadcast one by one

										_async.eachSeries(downloadableMoments.reverse(),function(moment, callback_moments) {
											_younow.downloadArchive(userinfo, moment.broadcastId, moment.created)
												.then(result => {
													callback_moments()
												}, err => {
													error(err)
													callback_moments(null)
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
	else if (settings.snapchat) {
		let db: Array<any> = await new FakeDB().open(path.join(settings.pathConfig, "snapchat_stories.db"), "Snapchat stories");

		users.forEach(async user => {
			await snapchat.getStories(user)
				.then(async stories => {

					if (!stories.story.snaps) {
						stories.story.snaps = [] as any
					}

					log("download from", stories.story.metadata.title, stories.story.snaps.length, "Stories")

					if (settings.json) {
						dos.writeFile(path.join(settings.pathDownload, user + ".json"), prettify(stories)).catch(error)
					}

					stories.story.snaps.forEach(async snap => {

						if (snap.id in db) {
						}
						else {

							log("download", snap.title, snap.media.type)

							let basename = path.join(settings.pathDownload, `${cleanFilename(stories.story.metadata.title)}_${formatDateTime(new Date(snap.captureTimeSecs * Time.MILLI))}`)

							let filenameVideo = basename + ".mp4"
							let filenameImage = basename + ".jpg"

							switch (snap.media.type) {
								case "VIDEO":
								case "VIDEO_NO_SOUND":
									if (!await dos.exists(filenameVideo)) {
										await download(snap.media.mediaUrl, filenameVideo)
									}
									break;
								case "IMAGE":
									if (!await dos.exists(filenameImage)) {
										await download(snap.media.mediaUrl, filenameImage)
									}
									break;
								default:
									error("snap.media.type", snap.media.type)
							}

							db[snap.id] = snap
						}
					})
				})
				.catch(error)
		})
	}
	else if (settings.periscope) {

		const db = await new FakeDB().open(path.join(settings.pathConfig, "periscope.json"), "Periscope lives")

		users.forEach(async user => {
			let url = periscope.parseURL(user)

			if (url) {
				await getURL(url, "utf8")
					.then(body => {
						try {
							if (body) {
								var match = body.toString().match(/data\-store\=\"(.+?)\"/i)

								if (match) {
									var result = match[1]

									result = result.replace(/&quot;/gi, `"`)
									result = result.replace(/&amp;/gi, `&`)

									let dataStore: Periscope.DataStore = JSON.parse(result)

									try {
										let tokens = dataStore.SessionToken
										let users = dataStore.UserCache.users
										let broadcasts = dataStore.BroadcastCache.broadcasts

										if (!tokens || !users) {
											throw "SessionToken or user is missing";
										}

										var user: Periscope.User = users[Object.keys(users)[0]].user

										return getURL(`${periscope.API}getUserBroadcastsPublic?user_id=${user.id}&all=true&session_id=${tokens.public.broadcastHistory.token.session_id}`)
											.then(json => {
												if (json) {
													let broadcasts: Array<Periscope.Broadcast> = json.broadcasts

													_async.eachSeries(broadcasts, function(broadcast, cbAsync) {
														try {

															if (broadcast.id == null) {
																throw new Error("broadcast.id==null")
															}
															else if (broadcast.id in db) {
																log(`${broadcast.id} already downloaded`)
																cbAsync()
															}
															else {
																log(`State:${broadcast.state} Twitter:${broadcast.twitter_username || "?"} username:${broadcast.username} nick:${broadcast.user_display_name} lang:${broadcast.language} country:${broadcast.country} city:${broadcast.city} status:${broadcast.status}`)

																if (broadcast.state == "ENDED" && broadcast.available_for_replay) {
																	periscope.getBroadcast(broadcast.id)
																		.then(video => {
																			if (video.broadcast.available_for_replay) {
																				//let cookies=replay.cookies.map(x=>`${x.Name}=${x.Value};`).join("")

																				let basename=periscope.createFilename(video.broadcast)

																				if (settings.thumbnail) {
																					periscope.downloadThumbnail(basename+".jpg",video.broadcast).catch(error)
																				}

																				if (settings.json) {
																					dos.writeFile(basename + ".json", JSON.stringify(video, null, "\t")).catch(error)
																				}

																				return periscope.downloadVideo(basename + "." + settings.videoFormat, video)
																					.then(bool => {
																						db[video.broadcast.id] = video.broadcast
																					})
																					.catch(err => {
																						log(`the problem is ${err}`)
																					})
																					.then(bool => {
																						log(`${video.broadcast.status} downloaded`)
																						cbAsync()
																					})
																			}
																			else {
																				cbAsync()
																			}
																		})
																		.catch(err => {

																			error(err)
																			cbAsync()
																		})
																}
																else {
																	cbAsync()
																}
															}
														}
														catch (e) {
															error(e)
															cbAsync()
														}

													}, function() {
													})
												}
											})
									}
									catch (e) {
										log(dataStore)
										error(e)
									}
								}
								else {
									error("fail to parse data-store")
								}
							}
						}
						catch (e) {
							error(e)
						}
					})
					.catch(error)

			}

		})
	}
	else {
		error("not implemented")
	}
}
