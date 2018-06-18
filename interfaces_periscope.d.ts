type weird_string = string;
type url_string = string

declare namespace Periscope {

	interface DataStore {
		SessionToken: Tokens
		UserCache:
		{
			users:
			{
				[index: string]:
				{
					user: User
				}
			},
			usernames:
			{
				[index: string]: string
			}
		}
		BroadcastCache:
		{
			Broadcasts:
			{
				[index: string]: Broadcast
			}
		}
	}

	// https://api.periscope.tv/api/v2/accessVideoPublic?broadcast_id=${bid}`

	interface VideoPublic {
		session: string //""
		"type": string // "StreamTypeWeb" || "StreamTypeReplay"
		"chat_token": string
		"life_cycle_token": string

		cookies:
		[
			{
				Name: string
				Value: string
			}
		]

		broadcast: Broadcast

		// live

		"hls_url": string
		"lhls_url": string
		"lhlsweb_url": string
		"https_hls_url": string
		"default_playback_buffer_length": number // 1,
		"min_playback_buffer_length": number //2,
		"max_playback_buffer_length": number // 5,

		// replay

		replay_url: string

	}

	interface Broadcast {
		class_name: 'Broadcast',
		id: string
		created_at: string
		updated_at: string
		user_id: string
		user_display_name: string
		username: string
		status: string
		twitter_id: string
		twitter_username: string
		profile_image_url: string
		state: string // RUNNING|ENDED
		is_locked: boolean
		friend_chat: boolean
		language: 'fr',
		start: string
		ping: string
		end: string
		has_moderation: boolean

		// location
		has_location: boolean
		city: string
		country: string
		country_state: string
		iso_code: string // FR RU
		ip_lat: number
		ip_lng: number
		// source
		// 320x568
		// 468x874
		width: number
		height: number
		camera_rotation: number // 358
		// periscope_ios_xxx
		// periscope_android_xxx
		// producer
		broadcast_source: string

		image_url: string
		image_url_small: string

		// live
		heart_theme: string[]

		available_for_replay: boolean
		expiration: -1,
		tweet_id: string
		media_key: string

		is_trusted: boolean

		n_total_watching: number // n_watchin+n_web_watching
		n_watching: number
		n_web_watching: number
		n_total_watched?: number

		sort_score: number // live=undef
		trust: boolean // live=undef
		interstitial: boolean // true | live:undef
		featured?: boolean // live=undef

		tags?: Array<string>
		share_user_ids?: Array<string>

	}

	interface User {
		"class_name": "User",
		"id": string //number
		"created_at": string //date
		"is_beta_user": false
		"is_employee": false
		"is_twitter_verified": false,
		"twitter_screen_name": weird_string
		"username": string
		"display_name": weird_string
		"description": weird_string
		"profile_image_urls": [
			{
				"url": url_string
				"ssl_url": url_string
				"width": 128,
				"height": 128
			},
			{
				"url": url_string
				"ssl_url": url_string
				"width": 200,
				"height": 200
			},
			{
				"url": url_string
				"ssl_url": url_string
				"width": 400,
				"height": 400
			}
		],
		"twitter_id": string //number
		"initials": "",
		"n_followers": number
		"n_following": number
		"is_following": false
		"is_muted": false
		"time": string //date
	}

	// "SessionToken"

	interface Tokens {
		"authed": {
			"broadcastHistory":
			{
				"token": {
					"session_id": number
				},
				"expiry": number
			},
			"thumbnailPlaylist": {
				"token": {
					"session_id": string
				},
				"expiry": number
			},
			"serviceToken": {
				"token": {
					"session_id": string
				},
				"expiry": number
			}
		},
		"public": {
			"broadcastHistory": {
				"token": {
					"session_id": string
				},
				"expiry": number
			},
			"thumbnailPlaylist": {
				"token": {
					"session_id": string
				},
				"expiry": number
			},
			"serviceToken": {
				"token": {
					"session_id": string
				},
				"expiry": number
			}
		}
	}

	interface LiveBroadcasts {
		Broadcasts:
		[
			{
				BID: string
				Featured: boolean
			}
		]
		NLive: number
		NReplay: number
	}

	interface LiveChannels {
		ChannelBroadcasts:
		[
			{
				Channel:
				{
					"CID": string //number,
					"Name": string //"#Travel",
					"Description": string //"#travel #explore #teleport #sunset & more",
					"UniversalLocales": null,
					"NLive": number
					"Featured": boolean
					"PublicTag": string //"#travel",
					"Slug": string //"travel",
					"ThumbnailURLs": null,
					"CreatedAt": string
					"LastActivity": string
					"Type": number //0,
					"OwnerId": string //"",
					"NMember": number //0
				}
				Broadcasts:
				[
					{
						BID: string
						Featured: boolean
					}
				]

			}
		]
	}
}
