type numberAsString = number

declare namespace Snapchat {
	interface Stories {
		"story":
		{
			"id": string // user id or trending_topics::xxxx
			"metadata":
			{
				"storyType": string // "TYPE_PUBLIC_USER_STORY" / "TYPE_DYNAMIC"
				"title": string // "nickname" or tagname
				"emoji": string //
				"canonicalUrlSuffix": string
			},
			"snaps":
			[
				{
					"id": string,
					"media":
					{
						"type": string // "VIDEO" / "VIDEO_NO_SOUND" / "IMAGE"
						/**
						* url to mp4
						*/
						"mediaUrl": string
						"mediaStreamingUrl": string // HLS
						"mediaPreviewUrl": string // JPG
					},
					"overlayImage":
					{
						"mediaUrl": string // PNG
						"mediaStreamingUrl": string // PNG
					},
					"title": string
					"captureTimeSecs": numberAsString
					subTitles?: string
				}
			]
		}
	}
}
