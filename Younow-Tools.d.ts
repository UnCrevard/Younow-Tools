/*
 *
 *
 *
*/

declare function isNaN(number: number | string): boolean;

declare namespace Younow {
	interface UserInfo {
		errorCode: number
		errorMsg: string

		profile: string,
		userId: number,
		channelId: number,
		level: number,
		firstName: string,
		lastName: string,
		country: string,
		broadcastsCount: string,
		state: string,
		city: string,

		totalFans: string,
		totalFansOf: string,
		description: string,

		twitterId: string,
		twitterHandle: string,
		youTubeUserName: string,
		youTubeChannelId: string,
		youTubeTitle: string,
		googleId: string,
		googleHandle: string,
		facebookId: string,
		instagramId: string,
		instagramHandle: string,
		facebookOption: string,
		facebookPageId: string,
		facebookPageTitle: string,
		websiteUrl: string,

		dateCreated: string, // YYYY-MM-DD HH-MM-SS
		useprofile: string,
		connectedSN: string,
		preferences: string,

		locale: string,		// en
		isSubscribable: number,
		totalSubscriptions: number,
		totalViews: number,
		language: string,		// en

		tumblrId: string,
		tumblrBlogTitle: string,
		globalSpenderRank: number,
		tribeName: string,
		subscriptionName: string,
		adminKeyWords: string,
		snKeyWords:
		{
			instagram:
			{
				firstName: string,
				lastName: null,
				nickname: string,
				description: string,
				url: string // URL
			}
		},
		points: string,

		levelsVer: string,
		fbfn: string,
		fbln: string,
		dynamoFirstName: string,
		dynamoLastName: string,
		lifeTimePoints: string,
		tumbleBlogTitle: string,
		alias: string,
		enableMoments: number,		// 1 = yes


		subscriptionMainUserId: number,
		isEp: boolean,
		epTag: string,
		totalSubscribers: number
	}

	/* Archive getBroadcastInfo() */

	interface ArchivedBroadcast {
		errorCode: number
		errorMsg: string

		videoAvailable: boolean
		noLongerAvailable: boolean
		isLive: number

		broadcastThumbnail: string	// URL
		awsUrl: string // URL
		hls: string	// URL

		userId: number
		firstName: string
		lastname: string
		profileUrlString: string

		broadcastTitle: string
		length: number	// sec

		twitterId: string
		youTubeUserName: string
		youTubeChannelId: string
		youTubeTitle: string

		entityType: string		// "b"
		timeAgo: string			// in days
		totalViewers: number
		totalChats: number
		totalLikes: number
		shares: number
		tags: string
	}

	/* LIVE getUserBroadcastInfoByXXX() */

	interface Comment {
		comment: string
		userId: string
		profileUrlString: string
		name: string
		userLevel: number
		target: number	// 0
		role: number	// 0
		paid: boolean
		subscriptionType: number	// 0
	}

	interface LiveBroadcast {
		errorCode: number
		errorMsg?: string

		broadcastId: number

		dateCreated: number
		dateStarted?: number // sometime missing
		length: number
		serverTime: number

		friendsReq: number
		viewers: number
		//seedingGroupsConfig: { '0': 50, '900': 20, '1500': 30 },
		//youtubeStart: '-1',
		//tdi: 'xxxxxxxx',
		shares: number
		broadcastOriginType: number	// 0=?
		//allowGuestCallers: '1',
		//topFansCount: '0',
		premiere: number	// 0
		//stickersMultiplier: '1',
		fans: number
		//dynamicPricedGoodies:{}
		locale: string	//'en'
		country: string		// 'XX'

		media:
		{
			host: string	// 'pullstream.younow.8686c.com/',
			app: string		// 'live',
			stream: string	// 'Stream-${bid}'
		}

		hlsSegmentSize: number	//'2'

		totalFans: number
		//vip: '',
		lviewers: number
		subscribersCount: number
		viewsWithThreshold: number
		broadcastsCount: number
		minChatLevel: number
		state: string	// 'onBroadcastPlay'
		stateCopy: string	// ''

		mirror: number	// '0'
		watermark: number	// '0'

		reconnects: number	// '0'

		platform: number	// 1=iOS 2=Android 3=PC
		//lastQuality: { percent: 0 },

		userlevel: number	// float
		chatMode: number	// '0'

		//isEditorsChoice: '',
		//isSeeding: '0',
		userId: number
		//room: '1',
		//mcuEnabled: '1',
		user:
		{
			userId: number
			profileUrlString: string
			facebookId: number
			//facebookOption: null,
			facebookUrl: string | null
			twitterHandle: string
			googleHandle: string | null
			userLevel: number
			description: string	// utf-8
			firstName: string
			lastName: string
			totalFans: number
			youTubeUserName: string | null	// 'channel/UCxxxxxxxxx'
			youTubeChannelId: string | null	// 'UCxxxxxx',
			youTubeTitle: string
			//isSubscribable: 0,
			//subscriptionMainUserId: 0
			//subscriptionName: ''
			//tribeName: null
			isPartner: boolean
			partner: number
		}
		points: number
		location?:
		{
			city: string		// ''
			state: string		// ''
			country: string		// 'GB'
		}
		//disabledGoodies: []
		//guestListCount: '0',
		//seedingStartTime: '0',
		//eligibleGroupsForPrompt: '[]',
		awsUrl: string	// url thumbnails 'https://ynassets.s3.amazonaws.com/broadcast/live/bid/bid.jpg',
		display_viewers: number
		//quality: '0',
		title: string
		username: string
		coins: number
		newUserEntersLastMessage: number
		//globalSpenderRank: '0',
		profile: string
		lastSegmentId: number	// HLS
		likes: number

		partner: number			// '0'
		isPartner: boolean

		tags: Array<string>
		tagPlayData: string // 'https://playdata.younow.com/live/tags/xxxxx==.json',
		disableSelfie: number	// '0'

		likePercent: number

		comments: Array<Comment>
		BaseBroadcastThumbURL: string // 'http://ynassets.s3.amazonaws.com',
		contestTag: boolean	// false
		// tfl: [],
		isEp: boolean	// false
		/** @prop useless */
		PlayDataBaseUrl: string // 'https://playdata.younow.com/live/xx/xx/'
		AllowMomentsCreation: number	// 1
		numMomentsCreated: number
		position: number
		//goodies:[]
		enableMoments: number	// 1
	}

	interface Tag {
		tag: string
		score: number
	}

	interface Trendings {
		errorCode: number
		errorMsg: string
		trending_tags: Array<Tag>
		featured_users: Array<any>
		trending_users:
		[
			{
				userId: string
				viewers: string,
				likes: string
				tags: any
				broadcastId: string,
				username: string
				userlevel: string	// float
				profile: string
				locale: string	// en
				shares: string
				fans: string
				totalFans: number
				globalSpenderRank: number
				position: number
				views: number
			}
		]
	}

	interface TagInfoUser {
		broadcastId: number
		fans: number		// current broadcast
		globalSpenderRank: number	// ?
		l: string	// en/es/de/tr/me
		likes: number
		position: number
		profile: string
		shares: number
		tags: Array<any>
		totalFans: number
		userId: number		// int
		userlevel: number
		username: string	// nickname w/space
		viewers: number		// current broadcast
		views: number		// current broadcast
	}

	interface TagInfo {
		errorCode: number
		errorMsg: string // "success"
		serverTime: number
		tag: string
		items: Array<TagInfoUser>
	}

	interface Moments {
		errorCode: number
		errorMsg: string
		serverTime: number
		hasMore: boolean
		items: Array<Moment | Collection>
	}

	interface Moment {
		type: string // moment
		broadcastId: number
		created: number
		broadcaster:
		{
			name: string		// username
			userId: number
			level: number
		}

	}
	interface Collection {

		type: string			// collection
		broadcastId: number
		created: number
		broadcaster:
		{
			name: string		// profile?
			userId: number
			level: number
		}
	}

	interface Followed {
		errorCode: number
		errorMsg?: string
		fans:
		[
			{
				userId: number
				profileUrlString: string
				firstName: string
				lastName: string
				description: string
			}
		],
		active: null
		hasNext: number	// 1
		count: number
	}

	const enum FollowedStatus {
		watching = 0,
		broadcasting = 2
	}

	interface FollowedOnline {
		errorCode: number
		errorMsg?: string
		nextRefresh: number,
		users:
		[
			{
				userId: number
				name: string
				status: number	// 0== watching 1 == ? 2==broadcasting
				level: number
				/** @type {number} [channelId where is the user] */
				channelId: number
				channelName: string
				profile: string
				globalSpenderRank: number
				viewers: number
				tags: Array<string>
			}
		]
		totalFans?: number
	}

	interface Followers {
		errorCode: number
		fans:
		[
			{
				userId: number
				profileUrlString: string
				firstName: string
				lastName: string
				description: string
			}
		]
		active: null
		hasNext: number	// 1=true
		count: number
	}

	interface FollowersOnline {

	}
}

declare namespace Utils {
	const enum Time {
		SECOND = 1000,
		MINUTE = 60000,
		HOUR = 3600000
	}
}

interface Settings {
	version: string
	/** data base path {string|null}*/
	pathDB: string
	/** final folder {string|null} */
	pathMove: string

	/** download/temp folder {string|null} */
	pathDownload: string
	generateDownloadFolderDate: boolean
	noDownload: boolean
	parallelDownloads: number
	pathConfig: string
	readonly FFMPEG_DEFAULT: string
	useFFMPEG: string
	videoFormat: string
	args: string[]
	locale: string
	timeout: number
	debug_file: string
	production: boolean
}

interface LiveUser {
	[index: number]:
	{
		userId: number
		broadcastId: number
		isIgnored: boolean
		isFollowed: boolean
		infos: Younow.LiveBroadcast
		check: number
	}
}

interface DBUser {
	ignore: boolean
	comment: string
	errorCode?: number
	errorMsg?: string

	profile: string
	userId: number

	firstName: string
	lastName: string

	country: string
	state: string
	city: string

	description: string

	twitterId: string,
	twitterHandle: string
	youTubeUserName: string
	youTubeChannelId: string
	youTubeTitle: string
	googleId: string
	googleHandle: string
	facebookId: string
	instagramId: string
	instagramHandle: string
	facebookPageId: string
	websiteUrl: string

	dateCreated: string
	locale: string
	language: string
	tumblrId: string
}

interface DB {
	[index: number]: DBUser
	self: any
}

interface Streams {
	[index: number]: Array<number>
}

interface Package {
	"name": "younow-tools",
	"version": "1.0.29",
	"description": "younow cli client",
	"main": "./js/main.js",
	"bin": {
		"younow": "./bin/younow"
	},
	"scripts": {
		"test": "younow -v api"
	},
	"keywords": [
		"younow"
	],
	"author": "UnCrevard@users.noreply.github.com",
	"license": "WTFPL",
	"repository": {
		"url": "https://github.com/UnCrevard/Younow-Tools",
		"type": "git"
	},
	"dependencies": {
		"async": "^2.6.0",
		"commander": "^2.15.1",
		"progress": "^2.0.0",
		"request": "^2.86.0"
	},
	"devDependencies": {
		"@types/async": "^2.0.49",
		"@types/commander": "^2.12.2",
		"@types/node": "^7.0.64",
		"@types/progress": "^1.1.28",
		"@types/request": "0.0.42",
		"source-map-support": "^0.4.18"
	},
	"engines": {
		"node": ">=6.10.2"
	},
	"changelog":
	{
		"1.0.29": "so many thing !!!"
	}
}

