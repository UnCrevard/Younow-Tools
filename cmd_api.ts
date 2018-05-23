import * as younow from "./module_younow"
import { log, error } from "./modules/module_log"
import * as _async from "async"

export async function cmdAPI() {
	younow.getTrendings()
		.then(async trendings => {
			if (trendings.errorCode) {
				throw new Error("Fatal")
			}

			log(`getTrendings result:${trendings.errorCode} users:${trendings.trending_users.length}`)

			let user = trendings.trending_users[0]
			let tag = trendings.trending_tags[0]
			let live = await younow.getLiveBroadcastByUID(user.userId)

			if (live.errorCode) {
				throw new Error("Fatal")
			}

			log(`getLiveBroadcastByUID:${live.errorCode ? live.errorMsg : "OK"}`)
			log(`getLiveBroadcastByUsername:${await younow.getLiveBroadcastByUsername(user.profile).then(x => x.errorCode ? x.errorMsg : "OK", error)}`)
			log(`getUserInfoByUID:${await younow.getUserInfoByUID(user.userId).then(x => x.errorCode ? x.errorMsg : "OK", error)}`)
			log(`getTagInfo:${await younow.getTagInfo(tag.tag).then(x => x.errorCode ? x.errorMsg : "OK", error)}`)
			log(`getMoments:${await younow.getMoments(user.userId, 0).then(x => x.errorCode ? x.errorMsg : "OK", error)}`)
			log(`getPlaylist:${await younow.getPlaylist(user.broadcastId).then(x => x.length ? "OK" : "Error", error)}`)
			//log(`downloadThumbnail:${await _younow.downloadThumbnail(user,live).then(x=>x?"OK":"Error",error)}`)
			//log(`saveJSON:${await _younow.saveJSON(user,live).then(x=>x?"OK":"Error",error)}`)
			//log(`downloadLiveStream:${await _younow.downloadLiveStream(live).then(x=>x?"OK":"Error",error)}`)
		})
		.catch(error)
}
