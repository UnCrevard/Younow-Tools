import * as younow from "./module_younow"
import { log, error } from "./modules/module_log"
import * as _async from "async"
import { getURL } from "./modules/module_www"
import * as dos from "./modules/module_promixified"

/*

	const from younow devs

*/
const apiMap =
	{
		"DNS":
			{
				"WEB": "https:\/\/www.younow.com",
				"DEFAULT": "https:\/\/api-dev.younow.com",
				"CDN": "https:\/\/cdn-vpc.younow.com",
				"YNASSETS": "https:\/\/ynassets.younow.com",
				"PLAYDATA": "https:\/\/playdata.younow.com",
				"TRACK": "https:\/\/track-vpc.younow.com",
				"ZENDESK": "https:\/\/younow.zendesk.com",
				"HLS": "https:\/\/hls.younow.com",
				"BCM": "https:\/\/bcm-dev.younow.com",
				"API2": "https:\/\/api-dev.younow.com",
				"CDN3": "https:\/\/cdn-vpc.younow.com",
				"YNASSETS_LOCAL": "https:\/\/ynassets.s3.amazonaws.com"
			},
		"BROADCAST_ADD":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/broadcast\/add"
			},
		"BROADCAST_AUDIENCE":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/broadcast\/audience"
			},
		"BROADCAST_AUDIENCE_CDN":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/broadcast\/audience"
			},
		"BROADCAST_CHAT":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/broadcast\/chat"
			},
		"BROADCAST_DOWNLOAD":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/broadcast\/download"
			},
		"BROADCAST_DROP":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/broadcast\/drop"
			},
		"BROADCAST_FAN_SUPPORTERS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/broadcast\/fanSupporters"
			},
		"BROADCAST_GET_SUPPORTER":
			{
				"DNS": "DEFAULT",
				"URL": "\/broadcast\/getSupporter"
			},
		"BROADCAST_GIFT":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/broadcast\/gift"
			},
		"BROADCAST_INFO":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/broadcast\/info"
			},
		"BROADCAST_INIT":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/broadcast\/init"
			},
		"BROADCAST_LIKE":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/broadcast\/like"
			},
		"BROADCAST_RECONNECT":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/broadcast\/reconnect"
			},
		"BROADCAST_SET_CHAT_MODE":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/broadcast\/setChatMode"
			},
		"BROADCAST_SHARE":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/broadcast\/share"
			},
		"BROADCAST_THANK_SUPPORTERS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/broadcast\/thankSupporters"
			},
		"BROADCAST_THUMB":
			{
				"DNS": "YNASSETS",
				"URL": "\/broadcast\/dev"
			},
		"BROADCAST_THUMB_DYNAMIC":
			{
				"DNS": "YNASSETS",
				"URL": "\/broadcastdynamic\/dev"
			},
		"BROADCAST_UPLOAD_THUMB":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/broadcast\/uploadThumb"
			},
		"BROADCAST_USER_DATA":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/broadcast\/userData"
			},
		"BROADCAST_VIDEO_PATH":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/broadcast\/videoPath"
			},
		"BROADCAST_REWIND":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/broadcast\/rewind"
			},
		"BROADCAST_SUPERMESSAGE":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/broadcast\/superMessage"
			},
		"BROADCAST_TURN":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/broadcast\/turn"
			},
		"CHANNEL_AWS_TOKEN":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/getAwsToken"
			},
		"CHANNEL_CANCEL_SUBSCRIPTION":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/cancelSubscription"
			},
		"CHANNEL_EDIT_BIO":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/editBio"
			},
		"CHANNEL_FAN":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/fan"
			},
		"CHANNEL_FEATURED_TAGS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/featuredTags"
			},
		"CHANNEL_FOLLOW":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/follow"
			},
		"CHANNEL_COVER":
			{
				"DNS": "YNASSETS",
				"URL": "\/cover\/dev"
			},
		"CHANNEL_COVER_LOCAL":
			{
				"DNS": "YNASSETS_LOCAL",
				"URL": "\/cover\/dev"
			},
		"CHANNEL_FANS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/getFans"
			},
		"CHANNEL_FANS_CDN":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/channel\/getFans"
			},
		"CHANNEL_FANSOF":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/getFansOf"
			},
		"CHANNEL_FANSOF_CDN":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/channel\/getFansOf"
			},
		"CHANNEL_IMAGE":
			{
				"DNS": "YNASSETS",
				"URL": "\/user\/dev"
			},
		"CHANNEL_IMAGE_LOCAL":
			{
				"DNS": "YNASSETS_LOCAL",
				"URL": "\/user\/dev"
			},
		"CHANNEL_INFO":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/getInfo"
			},
		"CHANNEL_INFO_CDN":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/channel\/getInfo"
			},
		"CHANNEL_LOCATION_ONLINE_FANS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/getLocationOnlineFans"
			},
		"CHANNEL_LOCATION_ONLINE_FANS_OF":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/getLocationOnlineFansOf"
			},
		"CHANNEL_NOTIFICATIONS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/getNotifications"
			},
		"CHANNEL_NOTIFICATION_SETTINGS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/getNotificationSettings"
			},
		"CHANNEL_ONLINE_FANS":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/channel\/getOnlineFans"
			},
		"CHANNEL_SUBSCRIBER_OF":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/getSubscriberOf"
			},
		"CHANNEL_SUBSCRIBER_OF_CDN":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/channel\/getSubscriberOf"
			},
		"CHANNEL_SUBSCRIBERS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/getSubscribers"
			},
		"CHANNEL_SUBSCRIBERS_CDN":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/channel\/getSubscribers"
			},
		"CHANNEL_TOP_PAID_FANS":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/channel\/getTopPaidFans"
			},
		"CHANNEL_USER_OPTIONS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/getUserOptions"
			},
		"CHANNEL_IS_BLOCKED":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/isBlocked"
			},
		"CHANNEL_IS_FAN":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/isFan"
			},
		"CHANNEL_IS_FAN_OF":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/isFanOf"
			},
		"CHANNEL_IS_FOLLOW":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/isFollow"
			},
		"CHANNEL_IS_SUBSCRIBER_OF":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/isSubscriberOf"
			},
		"CHANNEL_RESET_STREAM_KEY":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/resetStreamKey"
			},
		"CHANNEL_SETTINGS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/settings"
			},
		"CHANNEL_SHARE_URL":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/shareUrl"
			},
		"CHANNEL_SUBSCRIPTIONS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/subscriptions"
			},
		"CHANNEL_UNFAN":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/unFan"
			},
		"CHANNEL_UPDATE_COVER":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/updateCover"
			},
		"CHANNEL_UPDATE_EDITORS_PICK":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/updateEditorsPick"
			},
		"CHANNEL_UPDATE_FANSHIP_MODE":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/updateFanshipMode"
			},
		"CHANNEL_UPDATE_FEATURED_TAGS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/updateFeaturedTags"
			},
		"CHANNEL_UPDATE_NOTIFICATION_SETTINGS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/updateNotificationSettings"
			},
		"CHANNEL_UPDATE_SETTINGS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/updateSettings"
			},
		"CHANNEL_UPDATE_THUMB":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/updateThumb"
			},
		"CHANNEL_UPDATE_UI_LANGUAGE":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/updateUILanguage"
			},
		"CHANNEL_UPDATE_USER_OPTION":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/updateUserOption"
			},
		"CHANNEL_YOUTUBE_LIVE_ENABLED":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/youtubeLiveEnabled"
			},
		"CHANNEL_VIP_CONFIRM_MAIL":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/vipConfirmMail"
			},
		"CHANNEL_PARTNER_EARNINGS_STATS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/partnerEarningsStats"
			},
		"CHANNEL_PARTNER_BROADCASTS_DATA":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/partnerBroadcastsData"
			},
		"CHANNEL_ACCEPT_AGREEMENT":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/acceptAgreement"
			},
		"CHANNEL_FAN_ON_BOARDING":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/fanOnBoarding"
			},
		"GUEST_CANCEL":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/guest\/cancel"
			},
		"GUEST_DECLINE":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/guest\/decline"
			},
		"GUEST_END":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/guest\/end"
			},
		"GUEST_INVITE":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/guest\/invite"
			},
		"GUEST_ISINVITABLE":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/guest\/isinvitable"
			},
		"GUEST_JOIN":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/guest\/join"
			},
		"GUEST_LIST":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/guest\/list"
			},
		"GUEST_LIST_CDN":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/guest\/list"
			},
		"GUEST_OPTIN":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/guest\/optin"
			},
		"GUEST_OPTOUT":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/guest\/optout"
			},
		"GUEST_RANDOM":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/guest\/random"
			},
		"IMAGE_SELFIE":
			{
				"DNS": "YNASSETS",
				"URL": "\/selfies\/dev"
			},
		"IMAGE_EXPLORE_THUMB":
			{
				"DNS": "CDN",
				"URL": "\/images\/public\/topics"
			},
		"IMAGE_SUBSCRIPTION_BADGE":
			{
				"DNS": "YNASSETS",
				"URL": "\/subscriptions\/dev"
			},
		"IMAGE_GIFTS_GOODIES":
			{
				"DNS": "YNASSETS",
				"URL": "\/gifts\/dev"
			},
		"IMAGE_GUEST_SNAPSHOTS":
			{
				"DNS": "YNASSETS",
				"URL": "\/guestsnapshots\/dev"
			},
		"IMAGE_DAILYSPIN":
			{
				"DNS": "YNASSETS",
				"URL": "\/dailyspin\/dev"
			},
		"PAYPAL_RETURN":
			{
				"DNS": "DEFAULT",
				"URL": "\/api\/paypal\/paypalReturn.php"
			},
		"POST_CREATE":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/post\/create"
			},
		"POST_DELETE":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/post\/delete"
			},
		"POST_GET":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/post\/get"
			},
		"POST_BROADCASTS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/post\/getBroadcasts"
			},
		"POST_COMMENTS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/post\/getComments"
			},
		"POST_MEDIA":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/post\/getMedia"
			},
		"POST_LIKE":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/post\/like"
			},
		"POST_PIN":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/post\/pin"
			},
		"POST_UNLIKE":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/post\/unlike"
			},
		"POST_UNPIN":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/post\/unpin"
			},
		"RECO_ANON":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/reco\/anon"
			},
		"RECO_IGNORE":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/reco\/ignore"
			},
		"RECO_LOGGED_IN":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/reco\/loggedIn"
			},
		"RECO_SUGGESTED_USERS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/reco\/broadcasters"
			},
		"RECO_SUGGESTED_USERS_ANON":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/reco\/broadcastersAnon"
			},
		"RECO_PROMOBANNER":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/reco\/promobanner"
			},
		"RECO_SUGGESTED_MOMENTS_ANON":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/reco\/momentsAnon"
			},
		"RECO_PROMOBANNERASSETS":
			{
				"DNS": "YNASSETS",
				"URL": "\/promobanners\/dev"
			},
		"SELFIE_ANNOUNCE":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/selfie\/announce"
			},
		"SELFIE_CLEAR":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/selfie\/clear"
			},
		"SELFIE_QUEUE":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/selfie\/queue"
			},
		"SELFIE_UPLOAD":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/selfie\/upload"
			},
		"STORE_BUY":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/store\/buy"
			},
		"STORE_CHANGE_SUBSCRIPTION_PAYMENT":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/store\/changeSubscriptionPayment"
			},
		"STORE_GOODIE":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/store\/goodie"
			},
		"STORE_GOODIES":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/store\/goodies"
			},
		"STORE_PAYEE_PAYABLE":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/store\/payeePayable"
			},
		"STORE_PRODUCTS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/store\/products"
			},
		"STORE_PRODUCER_PRODUCTS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/store\/producerProducts"
			},
		"STORE_PURCHASE_TOKEN":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/store\/purchaseToken"
			},
		"STORE_SET_STATE":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/store\/setState"
			},
		"STORE_SUBSCRIPTION_PRODUCTS":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/store\/subscriptionProducts"
			},
		"STORE_TIPALTI_IFRAME_SRC":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/store\/tipaltiIframeSrc"
			},
		"STORE_VERIFY_CREDIT_CARD":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/store\/verifyCreditCard"
			},
		"STORE_BUY_PRE_CHECK":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/store\/buyPreCheck"
			},
		"STORE_SPIN":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/store\/spin"
			},
		"GIFTS_DATA":
			{
				"DNS": "YNASSETS",
				"URL": "\/giftsData\/dev"
			},
		"URL_EULA":
			{
				"DNS": "CDN",
				"URL": "\/eula.php"
			},
		"URL_FAQ":
			{
				"DNS": "ZENDESK",
				"URL": "\/hc\/en-us"
			},
		"URL_PARTNER_AGREEMENT":
			{
				"DNS": "CDN",
				"URL": "\/partner\/agreement.php"
			},
		"URL_PARTNER_GUIDELINES":
			{
				"DNS": "CDN",
				"URL": "\/partner\/agreement.php"
			},
		"URL_PARTNER_DMCA":
			{
				"DNS": "CDN",
				"URL": "\/partner\/dmca.html"
			},
		"URL_TERMS":
			{
				"DNS": "CDN",
				"URL": "\/terms.php"
			},
		"URL_POLICY":
			{
				"DNS": "WEB",
				"URL": "\/policy"
			},
		"YOUNOW_CONFIG":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/younow\/config"
			},
		"YOUNOW_CONFIG_CLOUD":
			{
				"DNS": "YNASSETS",
				"URL": "\/clients\/dev\/config.json"
			},
		"YOUNOW_CONNECT":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/younow\/connect"
			},
		"YOUNOW_DASHBOARD":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/younow\/dashboard"
			},
		"YOUNOW_DEVICE_CHANNEL":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/younow\/deviceChannel"
			},
		"YOUNOW_FEATURED":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/younow\/featured"
			},
		"YOUNOW_FEATURED_ON_TOPIC_USERS":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/younow\/featuredOnTopicUsers"
			},
		"YOUNOW_ME":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/younow\/me"
			},
		"YOUNOW_LOGIN":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/younow\/login"
			},
		"YOUNOW_LOGOUT":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/younow\/logout"
			},
		"YOUNOW_NOTIFICATIONS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/younow\/notificationCount"
			},
		"YOUNOW_ON_BOARDING":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/younow\/onBoarding"
			},
		"YOUNOW_ON_BOARDING_VIP_USERS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/younow\/onBoardingVipUsers"
			},
		"YOUNOW_MCN_CONTENT_CREATOR":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/younow\/mcnContentCreator"
			},
		"YOUNOW_P2P_LIST":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/younow\/p2plist"
			},
		"YOUNOW_POPULAR_TAGS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/younow\/popularTags"
			},
		"YOUNOW_PREMIERES":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/younow\/premieres"
			},
		"YOUNOW_QUEUE":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/younow\/queue"
			},
		"YOUNOW_REFERRAL_CODE":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/younow\/referralCode"
			},
		"YOUNOW_REGISTER_DEVICE":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/younow\/registerDevice"
			},
		"YOUNOW_SEND_TO_PHONE":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/younow\/sendToPhone"
			},
		"YOUNOW_SEARCH":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/younow\/search"
			},
		"YOUNOW_TAGS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/younow\/tags"
			},
		"YOUNOW_TOP_BROADCASTERS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/younow\/topBroadcasters"
			},
		"YOUNOW_TRENDING_TAGS":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/younow\/trendingTags"
			},
		"YOUNOW_TRENDING_USERS":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/younow\/trendingUsers"
			},
		"YOUNOW_USER":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/younow\/user"
			},
		"YOUNOW_VIPS":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/younow\/vips"
			},
		"YOUNOW_LB_TOP_BROADCASTERS":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/younow\/topBroadcastersLeaderboard"
			},
		"YOUNOW_LB_TOP_CREATORS":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/younow\/topCreatorsLeaderboard"
			},
		"YOUNOW_LB_EDITORS_CHOICE":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/younow\/topEditorsLeaderboard"
			},
		"YOUNOW_LB_TOP_SPENDERS":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/younow\/topSpendersLeaderboard"
			},
		"YOUNOW_TOP_LB_USERS":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/younow\/topOverallLeaderboard"
			},
		"YOUNOW_LB_TRENDING_MOMENTS":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/younow\/topTrendingMoments"
			},
		"YOUNOW_BROADCASTER_TIERS":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/younow\/broadcasterTiers"
			},
		"YOUNOW_CONTEST_LEADERBOARDS":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/younow\/contestLeaderboards"
			},
		"DO_ADMIN_ACTION":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/doAdminAction"
			},
		"GET_SNAPSHOT":
			{
				"DNS": "CDN",
				"URL": "\/php\/api\/getSnapshot"
			},
		"GET_USER_ACTIONS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/getUserActions"
			},
		"INSTAGRAM_AUTH":
			{
				"DNS": "DEFAULT",
				"URL": "\/instagramAuth.php"
			},
		"PARTNER_PAGE":
			{
				"DNS": "DEFAULT",
				"URL": "\/partners"
			},
		"PARTNER_FORM":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/channel\/partnerForm"
			},
		"RECENTLY_BROADCASTED":
			{
				"DNS": "DEFAULT",
				"URL": "\/recentlybroadcasted.php"
			},
		"TUMBLR_AUTH":
			{
				"DNS": "DEFAULT",
				"URL": "\/tumblrAuth.php"
			},
		"TWITTER_LOGIN":
			{
				"DNS": "DEFAULT",
				"URL": "\/twitterLogin.php"
			},
		"PUSHER_AUTH":
			{
				"DNS": "DEFAULT",
				"URL": "\/api\/pusherAuth.php"
			},
		"PUSHER_AUTH_DEDICATED":
			{
				"DNS": "DEFAULT",
				"URL": "\/api\/pusherAuthDedicated.php"
			},
		"SEND_ERROR_EVENT_MOBILE":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/sendErrorEventMobile"
			},
		"TRACKING":
			{
				"DNS": "TRACK",
				"URL": ""
			},
		"MOMENT_FEED":
			{
				"DNS": "API2",
				"URL": "\/php\/api\/moment\/feed"
			},
		"MOMENT_LIKE":
			{
				"DNS": "API2",
				"URL": "\/php\/api\/moment\/like"
			},
		"MOMENT_IS_LIKED":
			{
				"DNS": "API2",
				"URL": "\/php\/api\/moment\/isLiked"
			},
		"MOMENT_PAIDLIKED":
			{
				"DNS": "API2",
				"URL": "\/php\/api\/moment\/paidLiked"
			},
		"MOMENT_CREATE":
			{
				"DNS": "API2",
				"URL": "\/php\/api\/moment\/create"
			},
		"MOMENT_PROFILE":
			{
				"DNS": "CDN3",
				"URL": "\/php\/api\/moment\/profile"
			},
		"MOMENT_PLAYLIST":
			{
				"DNS": "HLS",
				"URL": "\/momentsplaylists\/dev"
			},
		"MOMENT_COLLECTION":
			{
				"DNS": "CDN3",
				"URL": "\/php\/api\/moment\/collection"
			},
		"MOMENT_VIEWED":
			{
				"DNS": "API2",
				"URL": "\/php\/api\/moment\/viewed"
			},
		"MOMENT_HIDE":
			{
				"DNS": "API2",
				"URL": "\/php\/api\/moment\/hide"
			},
		"MOMENT_COLLECTION_DELETE":
			{
				"DNS": "API2",
				"URL": "\/php\/api\/moment\/collectionDelete"
			},
		"MOMENT_DELETE":
			{
				"DNS": "API2",
				"URL": "\/php\/api\/moment\/delete"
			},
		"MOMENT_THUMB":
			{
				"DNS": "HLS",
				"URL": "\/momentsthumbs\/dev"
			},
		"MOMENT_FETCH":
			{
				"DNS": "CDN3",
				"URL": "\/php\/api\/moment\/fetch"
			},
		"MOMENT_LIKES":
			{
				"DNS": "CDN3",
				"URL": "\/php\/api\/moment\/likes"
			},
		"GEMS_CHECKOUT_REQUEST":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/gemsCheckout\/request"
			},
		"GEMS_CHECKOUT_STATUS":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/gemsCheckout\/status"
			},
		"GEMS_CHECKOUT_TOKEN":
			{
				"DNS": "DEFAULT",
				"URL": "\/php\/api\/gemsCheckout\/token"
			},
		"GEMS_CHECKOUT":
			{
				"DNS": "DEFAULT",
				"URL": "\/gems-checkout"
			}
	}

export async function cmdAPI() {

	try
	{
	const trendings=await younow.getTrendings()

	if (trendings.errorCode) throw "getTrendings fail"

	log(`getTrendings result:${trendings.errorCode} users:${trendings.trending_users.length}`)

	let tag = trendings.trending_tags[0] // pick up a tag

	let tagInfo = await younow.getTagInfo(tag.tag)

	if (tagInfo.errorCode) throw "getTagInfo fail"

	let user = tagInfo.items[0] // pick up a user

	log(`getLiveBroadcastByUID:${await younow.getLiveBroadcastByUID(user.userId).then(x=>x.errorCode?x.errorMsg:"OK",error)}`)
	log(`getLiveBroadcastByUsername:${await younow.getLiveBroadcastByUsername(user.profile).then(x => x.errorCode ? x.errorMsg : "OK", error)}`)
	log(`getUserInfoByUID:${await younow.getUserInfoByUID(user.userId).then(x => x.errorCode ? x.errorMsg : "OK", error)}`)
	log(`getTagInfo:${await younow.getTagInfo(tag.tag).then(x => x.errorCode ? x.errorMsg : "OK", error)}`)
	log(`getMoments:${await younow.getMoments(user.userId, 0).then(x => x.errorCode ? x.errorMsg : "OK", error)}`)
	log(`getPlaylist:${await younow.getPlaylist(user.broadcastId)}`)

	}
	catch(e)
	{
		error (e)
	}
}
