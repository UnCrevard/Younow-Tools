/*
 *
 *
 *
*/

/// <reference path="../__typing/younow.d.ts" />
/// <reference path="../__typing/periscope.d.ts" />
/// <reference path="../__typing/snapchat.d.ts" />
/// <reference path="../__typing/vk.d.ts" />


declare function isNaN(number: number | string): boolean;

declare namespace Utils {
	const enum Time {
		SECOND = 1000,
		MINUTE = 60000,
		HOUR = 3600000
	}
}

declare interface Settings {
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
	useFFMPEG: string
	videoFormat: string
	args: string[]
	locale: string
	timeout: number
	debug_file: string
	production: boolean
	json: boolean
	thumbnail: boolean
	snapchat: boolean
	younow: boolean
	periscope: boolean
	vk: boolean
	filenameTemplate:string
}
declare module NodeJS {
	interface Global {
		//verbosity: number,
		settings: Settings
	}
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

