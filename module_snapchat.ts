import { getURL } from "./modules/module_www"
import { log, error } from "./modules/module_log"

const API_STORIES = "https://storysharing.snapchat.com"
/**
 * get list of official stories
 *
 * @param  {string}
 * @return {Promise<Snapchat.Stories>}
 */
export function getStories(username: string): Promise<Snapchat.Stories> {
	let url = `${API_STORIES}/v1/fetch/${username}?request_origin=ORIGIN_WEB_PLAYER`
	return getURL(url)
}
