import { settings } from "./main"

import * as _fs from "fs"
import * as _path from "path"
import * as _url from "url"
import * as _async from "async"
import * as _progress from "progress"
import { execFile, spawn } from "child_process"
import { log, info, error, debug, prettify } from "./modules/module_log"
import { FakeDB } from "./modules/module_db"
import * as dos from "./modules/module_promixified"
import { downloadSegments } from "./module_hls_younow"
import { formatDate, formatTime, formatDateTime } from "./modules/module_utils"
import { getURL } from "./modules/module_www"
import { VideoWriter } from "./modules/module_ffmpeg"


// CDN=400 API=200 https://cdn.younow.com/php/api/broadcast/info/user=XXX


// api.younow.com = amazon
// cdn.younow.com = cloudflare

const API = "https://api.younow.com"
const CDN = "https://cdn.younow.com"

export function extractUser(user): string {
	/** @todo filtering illegal/HTML chars */

	// string : 0-9 a-z . - _

	if (isNaN(user)) {
		var pos = user.lastIndexOf("/")
		return (pos < 0) ? user : user.substring(pos + 1)
	}
	else {
		return user
	}
}

export function errortoString(result: { errorCode: number, errorMsg?: string }) {
	return `${result.errorCode} ${result.errorMsg}`
}

// errorCode: 101, errorMsg: 'Invalid user Id
// 	errorCode: 5501, errorMsg: 'Invalid channel ID'
//
// `https://api.younow.com/php/api/broadcast/info/channelId=${user}`

/**
 *
 * async get user from db / online
 *
 * @param {string|number} profile|userId
 * @return Promise<Younow.UserInfo|DBUser>
 *
 */
export function resolveUser(db: DB, user: string | number): Promise<Younow.UserInfo | DBUser> {
	let userdb = isUsernameInDB(db, user)

	if (userdb) {
		userdb.errorCode = 0
		return Promise.resolve(userdb)
	}
	else {
		if (isNaN(user as any)) {
			return getLiveBroadcastByUsername(user)
				.then(infos => {
					if (infos.errorCode == 0 || infos.errorCode == 206) {
						return getUserInfoByUID(infos.userId)
							.then(infos => infos)
					}
					else {
						return infos as any
					}
				})
		}
		else {
			return getUserInfoByUID(user)
				.then(infos => {
					if (infos.userId) {
						return infos
					}
					else {
						/** non existing uid */
						infos.errorCode = 101
						infos.errorMsg = "Invalid user Id"
						return infos
					}
				})
		}
	}
}

/**
 *
 * @function async
 *
 */
export function getUserInfoByUID(uid): Promise<Younow.UserInfo> {
	// /includeUserKeyWords=1
	return getURL(`${API}/php/api/channel/getInfo/channelId=${uid}`)
}

export function getLiveBroadcastByUsername(username): Promise<Younow.LiveBroadcast> {
	return getURL(`${API}/php/api/broadcast/info/curId=0/user=${username}`)
}

export function getLiveBroadcastByUID(uid): Promise<Younow.LiveBroadcast> {
	return getURL(`${API}/php/api/broadcast/info/channelId=${uid}/curId=0`)
}

//** @async {uid} get past broadcasts*/

/*
export function getArchivedBroadcasts(uid):Promise<any>
{
	//return getURL(`https://api.younow.com/php/api/post/getBroadcasts/startFrom=0/channelId=${uid}`)
	//return getURL(`https://api.younow.com/php/api/broadcast/~channelId=${uid}`)
	//return getURL(`https://cdn2.younow.com/php/api/post/getBroadcasts/startFrom=0/channelId=${uid}`)

	return Promise.reject(null)
}
*/

export function getArchivedBroadcast(bid): Promise<Younow.ArchivedBroadcast> {
	// errorCode:246/Broadcast is still live

	return getURL(`${API}/php/api/broadcast/videoPath/broadcastId=${bid}`)
}

export function getMoments(uid, next): Promise<Younow.Moments> {
	return getURL(`${API}/php/api/moment/profile/channelId=${uid}/createdBefore=${next}`)
}

// https://api.younow.com/php/api/younow/topBroadcasters/numberOfRecords=20/startFrom=0/tag=${tag}
// https://cdn.younow.com/php/api/younow/dashboard/locale={ww|en}/trending=50

export function getTrendings(): Promise<Younow.Trendings> {
	// cdn2
	return getURL(`${API}/php/api/younow/dashboard/locale=${settings.locale}/trending=50`)
}

export function getTagInfo(tag): Promise<Younow.TagInfo> {

	return getURL(`https://playdata.younow.com/live/tags/${Buffer.from(tag).toString("base64")}.json`)
}

/**
 *
 * @function downloadArchive - download archived broadcast
 * @return Promise<boolean>
 */
export async function downloadArchive(user: Younow.UserInfo | DBUser, bid: number, started: number | null): Promise<any> {
	info("downloadArchive", user.profile, bid)

	if (settings.noDownload) {
		return true
	}

	let archive = await getArchivedBroadcast(bid)

	if (archive.errorCode) {
		error(`${user.profile} ${bid} ${archive.errorCode} ${archive.errorMsg}`)
		return false
	}

	let fix: Younow.LiveBroadcast = archive as any

	fix.dateStarted = started || (new Date(archive.broadcastTitle).getTime() / 1000)
	fix.profile = user.profile
	fix.broadcastId = bid
	fix.country = user.country
	fix.awsUrl = archive.broadcastThumbnail

	let video_filename = createFilename(archive as any) + "." + settings.videoFormat

	saveJSON(archive as any).catch(error)
	downloadThumbnail(archive as any).catch(error)

	let exists = await dos.exists(video_filename)

	if (!exists) {
		return getURL(archive.hls, "utf8")
			//@ts-ignore
			.then((playlist: string) => {
				let m = playlist.match(/\d+\.ts/g)

				if (!m) {
					error(playlist)
					return false
				}

				let total_segment = m.length

				m = archive.hls.match(/(https:.+)playlist.m3u8/i)

				if (!m) {
					error(archive.hls)
					return false
				}

				let url = m[1]

				let bar = new _progress(`${user.profile} ${bid} :bar :percent :elapseds/:etas :rate/bps`,
					{
						total: total_segment,
						width: 20,
						complete: "●",
						incomplete: "○",
						clear: true
					})

				return downloadSegments(settings, url, video_filename, total_segment, bar, false)
					.then(err => {
						dos.timeout(10000)
							.then(err => {
								return moveFile(video_filename)
							})
							.catch(error)
					})
			})
			.catch(error)
	}
	else {
		return false
	}
}

export function getPlaylist(bid): Promise<string> {
	return getURL(`${API}/php/api/broadcast/videoPath/hls=1/broadcastId=${bid}`, "utf8")
}

/** returns Promise<[json:boolean,image:boolean,video:boolean]> */

export async function downloadThemAll(live: Younow.LiveBroadcast) {
	if (settings.noDownload) {
		return [true, true, true]
	}
	else {
		return Promise.all([saveJSON(live), downloadThumbnail(live), downloadLiveStream(live)])
	}
}

/**
 * @todo cleanup
 * downloadLiveStream- download live broadcast
 * returns Promise<whatever>
 */

/*
export async function downloadLiveStream(live: Younow.LiveBroadcast): Promise<any> {
	if (live.errorCode == 0) {
		let filename = createFilename(live) + "." + settings.videoFormat

		let exists = await dos.exists(filename)

		if (!exists) {
			return getPlaylist(live.broadcastId)
				.then((playlist: string) => {
					let m = playlist.match(/https:.+\d+.ts/gi)

					if (m) {
						debug(`M3U8 ${m.length} ${m[1]}`)

						m = m.pop().match(/(https:.+\/)(\d+).ts/i)

						if (m) {
							let url = m[1]
							let current_segment = Number(m[2])

							info(`REWIND ${live.user.profileUrlString}`)

							return downloadSegments(settings, url, filename, current_segment, null, true)
								.then((stream: VideoWriter) => {
									if (!stream) {
										debug(`STREAM null ${live.user.profileUrlString} ${stream}`)
										return false
									}

									return new Promise((resolve, reject) => {
										info(`STREAM ${live.user.profileUrlString}`)

										let interval = 0
										let fail = 0
										let step = 250
										let slow_down = 0.01

										_async.forever(next => {
											getURL(`${url}${current_segment}.ts`, null)
												.then(buffer => {
													fail = 0

													interval = interval - interval * slow_down

													current_segment++

													stream.write(buffer, err => {
														setTimeout(next, interval)
													})
												}, err => {

													fail++

													if (fail < 10 && err == 403) {
														interval += step

														debug(`STREAM ERROR ${live.user.profileUrlString} Err:${err} Fail:${fail} Interval:${interval}`)

														setTimeout(next, interval)
													}
													else {
														debug(`STREAM ABORT ${live.user.profileUrlString} Err:${err} Fail:${fail} Interval:${interval}`)
														next(true)
													}
												})
										}, err => {
											stream.close(err => {
												resolve(true) // @WTF
											})
										})
									})
								}, err => err)
								.then(err => {
									debug(`STREAM MOVE ${live.user.profileUrlString} Err:${err}`)

									return new Promise(resolve => {
										setTimeout(() => {
											resolve(moveFile(filename))
										}, 10000)
									})
								})
						}
						else {
							error(playlist)
							return false
						}
					}
					else {
						error(playlist)
						return false
					}
				})
		}
	}
}
*/

export async function downloadLiveStream(live: Younow.LiveBroadcast): Promise<any> {

	//20180523 : using rtmp stream instead of HLS after younow change.

	if (live.errorCode == 0) {

		return new Promise(async (resolve, reject) => {
			let filename = createFilename(live) + "." + settings.videoFormat

			let exists = await dos.exists(filename)

			if (!exists) {
				let params = `-i rtmp://${live.media.host}${live.media.app}/${live.media.stream} ${settings.useFFMPEG} ${filename}`.split(" ")

				let ffmpeg = spawn("ffmpeg", params)

				ffmpeg.on("error", err => {
					reject(err)
				})

				ffmpeg.on("exit", code => {
					if (code) {
						error(`FFMPEG exit ${code}`)
					}
				})

				ffmpeg.on("close", code => {

					moveFile(filename).
						then(err => {
							resolve("ok")
						})
						.catch(err => {
							reject(err)
						})
				})

				ffmpeg.stderr.on("data", data => {
					//log(data.toString())
				})

				ffmpeg.stdin.on("error", err => err)
			}
		});

	}
	else {
		return Promise.reject(live.errorMsg)
	}
}

export async function downloadThumbnail(live: Younow.LiveBroadcast): Promise<boolean> {
	if (live.errorCode == 0) {
		let filename = createFilename(live) + ".jpg"

		let exists = await dos.exists(filename)

		if (!exists) {
			let image: Buffer = await getURL(live.awsUrl, null)
			await dos.writeFile(filename, image)
			await moveFile(filename)
			info("downloadThumbnail", image.length, filename)
		}
		return true
	}
	return false
}

export async function saveJSON(live: Younow.LiveBroadcast): Promise<boolean> {
	if (live.errorCode == 0) {
		let filename = createFilename(live) + ".json"

		let exists = await dos.exists(filename)

		if (!exists) {
			await dos.writeFile(filename, prettify(live))
			await moveFile(filename)
			info("saveJSON", filename)
		}
		return true
	}
	return false
}
/*
*
* returns std filename
*
*/
export function createFilename(live: Younow.LiveBroadcast) {
	let filename = _path.join(settings.pathDownload, `${live.country || "XX"}_${live.profile}_${formatDateTime(new Date((live.dateStarted || live.dateCreated || Date.now() / 1000) * 1000))}_${live.broadcastId}`)

	debug("createFilename", filename)

	return filename
}

async function moveFile(filename: string) {
	if (settings.pathMove) {
		let newpath = _path.join(settings.pathMove, _path.parse(filename).base)

		info("moveFile", filename, newpath)
		return dos.rename(filename, newpath)
	}
}

export function getFollowed(userId: number, start: number) {
	return getURL(`${API}/php/api/channel/getFansOf/channelId=${userId}/startFrom=${start}/numberOfRecords=50`)
}

export function getOnlineFollowed(follower: number) {
	return getURL(`${API}/php/api/channel/getLocationOnlineFansOf/channelId=${follower}/numberOfRecords=50`)
}

/** Normalize user info
 *
 * @param {Younow.UserInfo}
 * @return {DBUser}
 *
 */
export function convertToUserDB(uid: number, user: Younow.UserInfo): DBUser {
	let dbuser: DBUser =
	{
		ignore: (user as any).ignore || false,
		comment: (user as any).comment || "---",

		profile: user.profile,
		userId: user.userId || uid,

		firstName: user.firstName,
		lastName: user.lastName,

		country: user.country || "XX",
		state: user.state,
		city: user.city,

		description: user.description,

		twitterId: user.twitterId,
		twitterHandle: user.twitterHandle,
		youTubeUserName: user.youTubeUserName,
		youTubeChannelId: user.youTubeChannelId,
		youTubeTitle: user.youTubeTitle,
		googleId: user.googleId,
		googleHandle: user.googleHandle,
		facebookId: user.facebookId,
		instagramId: user.instagramId,
		instagramHandle: user.instagramHandle,
		facebookPageId: user.facebookId,
		websiteUrl: user.websiteUrl,

		dateCreated: user.dateCreated,
		locale: user.locale,
		language: user.language,
		tumblrId: user.tumblrId
	}

	for (let i in dbuser) {
		if (dbuser[i] === "" || dbuser[i] === null || dbuser[i] === undefined) {
			delete dbuser[i]
		}
	}

	return dbuser
}

export function openDB() {
	return new FakeDB().open(settings.pathDB, "Broadcasters")
}

/** Search profile in the db
 *
 * @param {string|number}  profile/profileUrlString or userId
 * @return {DBUser|null}
 */
export function isUsernameInDB(db: DB, user: string | number): DBUser | null {
	if (isNaN(user as any)) {
		var regex = new RegExp("^" + user + "$", "i")

		/** @todo */

		for (let i of Object.keys(db)) {
			let dbuser = db[i]

			let profile = dbuser.profile

			if (profile) {
				if (profile.match(regex)) {
					return dbuser
				}
			}
		}

		return null
	}
	else {
		return db[user] || null
	}
}
