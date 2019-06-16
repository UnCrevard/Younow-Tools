"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const younow = require("./modules/module_younow");
const module_log_1 = require("./modules/module_log");
const apiMap = {
    "DNS": {
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
    "BROADCAST_ADD": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/broadcast\/add"
    },
    "BROADCAST_AUDIENCE": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/broadcast\/audience"
    },
    "BROADCAST_AUDIENCE_CDN": {
        "DNS": "CDN",
        "URL": "\/php\/api\/broadcast\/audience"
    },
    "BROADCAST_CHAT": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/broadcast\/chat"
    },
    "BROADCAST_DOWNLOAD": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/broadcast\/download"
    },
    "BROADCAST_DROP": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/broadcast\/drop"
    },
    "BROADCAST_FAN_SUPPORTERS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/broadcast\/fanSupporters"
    },
    "BROADCAST_GET_SUPPORTER": {
        "DNS": "DEFAULT",
        "URL": "\/broadcast\/getSupporter"
    },
    "BROADCAST_GIFT": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/broadcast\/gift"
    },
    "BROADCAST_INFO": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/broadcast\/info"
    },
    "BROADCAST_INIT": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/broadcast\/init"
    },
    "BROADCAST_LIKE": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/broadcast\/like"
    },
    "BROADCAST_RECONNECT": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/broadcast\/reconnect"
    },
    "BROADCAST_SET_CHAT_MODE": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/broadcast\/setChatMode"
    },
    "BROADCAST_SHARE": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/broadcast\/share"
    },
    "BROADCAST_THANK_SUPPORTERS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/broadcast\/thankSupporters"
    },
    "BROADCAST_THUMB": {
        "DNS": "YNASSETS",
        "URL": "\/broadcast\/dev"
    },
    "BROADCAST_THUMB_DYNAMIC": {
        "DNS": "YNASSETS",
        "URL": "\/broadcastdynamic\/dev"
    },
    "BROADCAST_UPLOAD_THUMB": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/broadcast\/uploadThumb"
    },
    "BROADCAST_USER_DATA": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/broadcast\/userData"
    },
    "BROADCAST_VIDEO_PATH": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/broadcast\/videoPath"
    },
    "BROADCAST_REWIND": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/broadcast\/rewind"
    },
    "BROADCAST_SUPERMESSAGE": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/broadcast\/superMessage"
    },
    "BROADCAST_TURN": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/broadcast\/turn"
    },
    "CHANNEL_AWS_TOKEN": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/getAwsToken"
    },
    "CHANNEL_CANCEL_SUBSCRIPTION": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/cancelSubscription"
    },
    "CHANNEL_EDIT_BIO": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/editBio"
    },
    "CHANNEL_FAN": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/fan"
    },
    "CHANNEL_FEATURED_TAGS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/featuredTags"
    },
    "CHANNEL_FOLLOW": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/follow"
    },
    "CHANNEL_COVER": {
        "DNS": "YNASSETS",
        "URL": "\/cover\/dev"
    },
    "CHANNEL_COVER_LOCAL": {
        "DNS": "YNASSETS_LOCAL",
        "URL": "\/cover\/dev"
    },
    "CHANNEL_FANS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/getFans"
    },
    "CHANNEL_FANS_CDN": {
        "DNS": "CDN",
        "URL": "\/php\/api\/channel\/getFans"
    },
    "CHANNEL_FANSOF": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/getFansOf"
    },
    "CHANNEL_FANSOF_CDN": {
        "DNS": "CDN",
        "URL": "\/php\/api\/channel\/getFansOf"
    },
    "CHANNEL_IMAGE": {
        "DNS": "YNASSETS",
        "URL": "\/user\/dev"
    },
    "CHANNEL_IMAGE_LOCAL": {
        "DNS": "YNASSETS_LOCAL",
        "URL": "\/user\/dev"
    },
    "CHANNEL_INFO": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/getInfo"
    },
    "CHANNEL_INFO_CDN": {
        "DNS": "CDN",
        "URL": "\/php\/api\/channel\/getInfo"
    },
    "CHANNEL_LOCATION_ONLINE_FANS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/getLocationOnlineFans"
    },
    "CHANNEL_LOCATION_ONLINE_FANS_OF": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/getLocationOnlineFansOf"
    },
    "CHANNEL_NOTIFICATIONS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/getNotifications"
    },
    "CHANNEL_NOTIFICATION_SETTINGS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/getNotificationSettings"
    },
    "CHANNEL_ONLINE_FANS": {
        "DNS": "CDN",
        "URL": "\/php\/api\/channel\/getOnlineFans"
    },
    "CHANNEL_SUBSCRIBER_OF": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/getSubscriberOf"
    },
    "CHANNEL_SUBSCRIBER_OF_CDN": {
        "DNS": "CDN",
        "URL": "\/php\/api\/channel\/getSubscriberOf"
    },
    "CHANNEL_SUBSCRIBERS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/getSubscribers"
    },
    "CHANNEL_SUBSCRIBERS_CDN": {
        "DNS": "CDN",
        "URL": "\/php\/api\/channel\/getSubscribers"
    },
    "CHANNEL_TOP_PAID_FANS": {
        "DNS": "CDN",
        "URL": "\/php\/api\/channel\/getTopPaidFans"
    },
    "CHANNEL_USER_OPTIONS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/getUserOptions"
    },
    "CHANNEL_IS_BLOCKED": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/isBlocked"
    },
    "CHANNEL_IS_FAN": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/isFan"
    },
    "CHANNEL_IS_FAN_OF": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/isFanOf"
    },
    "CHANNEL_IS_FOLLOW": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/isFollow"
    },
    "CHANNEL_IS_SUBSCRIBER_OF": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/isSubscriberOf"
    },
    "CHANNEL_RESET_STREAM_KEY": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/resetStreamKey"
    },
    "CHANNEL_SETTINGS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/settings"
    },
    "CHANNEL_SHARE_URL": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/shareUrl"
    },
    "CHANNEL_SUBSCRIPTIONS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/subscriptions"
    },
    "CHANNEL_UNFAN": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/unFan"
    },
    "CHANNEL_UPDATE_COVER": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/updateCover"
    },
    "CHANNEL_UPDATE_EDITORS_PICK": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/updateEditorsPick"
    },
    "CHANNEL_UPDATE_FANSHIP_MODE": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/updateFanshipMode"
    },
    "CHANNEL_UPDATE_FEATURED_TAGS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/updateFeaturedTags"
    },
    "CHANNEL_UPDATE_NOTIFICATION_SETTINGS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/updateNotificationSettings"
    },
    "CHANNEL_UPDATE_SETTINGS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/updateSettings"
    },
    "CHANNEL_UPDATE_THUMB": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/updateThumb"
    },
    "CHANNEL_UPDATE_UI_LANGUAGE": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/updateUILanguage"
    },
    "CHANNEL_UPDATE_USER_OPTION": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/updateUserOption"
    },
    "CHANNEL_YOUTUBE_LIVE_ENABLED": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/youtubeLiveEnabled"
    },
    "CHANNEL_VIP_CONFIRM_MAIL": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/vipConfirmMail"
    },
    "CHANNEL_PARTNER_EARNINGS_STATS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/partnerEarningsStats"
    },
    "CHANNEL_PARTNER_BROADCASTS_DATA": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/partnerBroadcastsData"
    },
    "CHANNEL_ACCEPT_AGREEMENT": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/acceptAgreement"
    },
    "CHANNEL_FAN_ON_BOARDING": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/fanOnBoarding"
    },
    "GUEST_CANCEL": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/guest\/cancel"
    },
    "GUEST_DECLINE": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/guest\/decline"
    },
    "GUEST_END": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/guest\/end"
    },
    "GUEST_INVITE": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/guest\/invite"
    },
    "GUEST_ISINVITABLE": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/guest\/isinvitable"
    },
    "GUEST_JOIN": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/guest\/join"
    },
    "GUEST_LIST": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/guest\/list"
    },
    "GUEST_LIST_CDN": {
        "DNS": "CDN",
        "URL": "\/php\/api\/guest\/list"
    },
    "GUEST_OPTIN": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/guest\/optin"
    },
    "GUEST_OPTOUT": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/guest\/optout"
    },
    "GUEST_RANDOM": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/guest\/random"
    },
    "IMAGE_SELFIE": {
        "DNS": "YNASSETS",
        "URL": "\/selfies\/dev"
    },
    "IMAGE_EXPLORE_THUMB": {
        "DNS": "CDN",
        "URL": "\/images\/public\/topics"
    },
    "IMAGE_SUBSCRIPTION_BADGE": {
        "DNS": "YNASSETS",
        "URL": "\/subscriptions\/dev"
    },
    "IMAGE_GIFTS_GOODIES": {
        "DNS": "YNASSETS",
        "URL": "\/gifts\/dev"
    },
    "IMAGE_GUEST_SNAPSHOTS": {
        "DNS": "YNASSETS",
        "URL": "\/guestsnapshots\/dev"
    },
    "IMAGE_DAILYSPIN": {
        "DNS": "YNASSETS",
        "URL": "\/dailyspin\/dev"
    },
    "PAYPAL_RETURN": {
        "DNS": "DEFAULT",
        "URL": "\/api\/paypal\/paypalReturn.php"
    },
    "POST_CREATE": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/post\/create"
    },
    "POST_DELETE": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/post\/delete"
    },
    "POST_GET": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/post\/get"
    },
    "POST_BROADCASTS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/post\/getBroadcasts"
    },
    "POST_COMMENTS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/post\/getComments"
    },
    "POST_MEDIA": {
        "DNS": "CDN",
        "URL": "\/php\/api\/post\/getMedia"
    },
    "POST_LIKE": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/post\/like"
    },
    "POST_PIN": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/post\/pin"
    },
    "POST_UNLIKE": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/post\/unlike"
    },
    "POST_UNPIN": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/post\/unpin"
    },
    "RECO_ANON": {
        "DNS": "CDN",
        "URL": "\/php\/api\/reco\/anon"
    },
    "RECO_IGNORE": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/reco\/ignore"
    },
    "RECO_LOGGED_IN": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/reco\/loggedIn"
    },
    "RECO_SUGGESTED_USERS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/reco\/broadcasters"
    },
    "RECO_SUGGESTED_USERS_ANON": {
        "DNS": "CDN",
        "URL": "\/php\/api\/reco\/broadcastersAnon"
    },
    "RECO_PROMOBANNER": {
        "DNS": "CDN",
        "URL": "\/php\/api\/reco\/promobanner"
    },
    "RECO_SUGGESTED_MOMENTS_ANON": {
        "DNS": "CDN",
        "URL": "\/php\/api\/reco\/momentsAnon"
    },
    "RECO_PROMOBANNERASSETS": {
        "DNS": "YNASSETS",
        "URL": "\/promobanners\/dev"
    },
    "SELFIE_ANNOUNCE": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/selfie\/announce"
    },
    "SELFIE_CLEAR": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/selfie\/clear"
    },
    "SELFIE_QUEUE": {
        "DNS": "CDN",
        "URL": "\/php\/api\/selfie\/queue"
    },
    "SELFIE_UPLOAD": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/selfie\/upload"
    },
    "STORE_BUY": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/store\/buy"
    },
    "STORE_CHANGE_SUBSCRIPTION_PAYMENT": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/store\/changeSubscriptionPayment"
    },
    "STORE_GOODIE": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/store\/goodie"
    },
    "STORE_GOODIES": {
        "DNS": "CDN",
        "URL": "\/php\/api\/store\/goodies"
    },
    "STORE_PAYEE_PAYABLE": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/store\/payeePayable"
    },
    "STORE_PRODUCTS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/store\/products"
    },
    "STORE_PRODUCER_PRODUCTS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/store\/producerProducts"
    },
    "STORE_PURCHASE_TOKEN": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/store\/purchaseToken"
    },
    "STORE_SET_STATE": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/store\/setState"
    },
    "STORE_SUBSCRIPTION_PRODUCTS": {
        "DNS": "CDN",
        "URL": "\/php\/api\/store\/subscriptionProducts"
    },
    "STORE_TIPALTI_IFRAME_SRC": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/store\/tipaltiIframeSrc"
    },
    "STORE_VERIFY_CREDIT_CARD": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/store\/verifyCreditCard"
    },
    "STORE_BUY_PRE_CHECK": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/store\/buyPreCheck"
    },
    "STORE_SPIN": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/store\/spin"
    },
    "GIFTS_DATA": {
        "DNS": "YNASSETS",
        "URL": "\/giftsData\/dev"
    },
    "URL_EULA": {
        "DNS": "CDN",
        "URL": "\/eula.php"
    },
    "URL_FAQ": {
        "DNS": "ZENDESK",
        "URL": "\/hc\/en-us"
    },
    "URL_PARTNER_AGREEMENT": {
        "DNS": "CDN",
        "URL": "\/partner\/agreement.php"
    },
    "URL_PARTNER_GUIDELINES": {
        "DNS": "CDN",
        "URL": "\/partner\/agreement.php"
    },
    "URL_PARTNER_DMCA": {
        "DNS": "CDN",
        "URL": "\/partner\/dmca.html"
    },
    "URL_TERMS": {
        "DNS": "CDN",
        "URL": "\/terms.php"
    },
    "URL_POLICY": {
        "DNS": "WEB",
        "URL": "\/policy"
    },
    "YOUNOW_CONFIG": {
        "DNS": "CDN",
        "URL": "\/php\/api\/younow\/config"
    },
    "YOUNOW_CONFIG_CLOUD": {
        "DNS": "YNASSETS",
        "URL": "\/clients\/dev\/config.json"
    },
    "YOUNOW_CONNECT": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/younow\/connect"
    },
    "YOUNOW_DASHBOARD": {
        "DNS": "CDN",
        "URL": "\/php\/api\/younow\/dashboard"
    },
    "YOUNOW_DEVICE_CHANNEL": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/younow\/deviceChannel"
    },
    "YOUNOW_FEATURED": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/younow\/featured"
    },
    "YOUNOW_FEATURED_ON_TOPIC_USERS": {
        "DNS": "CDN",
        "URL": "\/php\/api\/younow\/featuredOnTopicUsers"
    },
    "YOUNOW_ME": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/younow\/me"
    },
    "YOUNOW_LOGIN": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/younow\/login"
    },
    "YOUNOW_LOGOUT": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/younow\/logout"
    },
    "YOUNOW_NOTIFICATIONS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/younow\/notificationCount"
    },
    "YOUNOW_ON_BOARDING": {
        "DNS": "CDN",
        "URL": "\/php\/api\/younow\/onBoarding"
    },
    "YOUNOW_ON_BOARDING_VIP_USERS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/younow\/onBoardingVipUsers"
    },
    "YOUNOW_MCN_CONTENT_CREATOR": {
        "DNS": "CDN",
        "URL": "\/php\/api\/younow\/mcnContentCreator"
    },
    "YOUNOW_P2P_LIST": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/younow\/p2plist"
    },
    "YOUNOW_POPULAR_TAGS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/younow\/popularTags"
    },
    "YOUNOW_PREMIERES": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/younow\/premieres"
    },
    "YOUNOW_QUEUE": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/younow\/queue"
    },
    "YOUNOW_REFERRAL_CODE": {
        "DNS": "CDN",
        "URL": "\/php\/api\/younow\/referralCode"
    },
    "YOUNOW_REGISTER_DEVICE": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/younow\/registerDevice"
    },
    "YOUNOW_SEND_TO_PHONE": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/younow\/sendToPhone"
    },
    "YOUNOW_SEARCH": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/younow\/search"
    },
    "YOUNOW_TAGS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/younow\/tags"
    },
    "YOUNOW_TOP_BROADCASTERS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/younow\/topBroadcasters"
    },
    "YOUNOW_TRENDING_TAGS": {
        "DNS": "CDN",
        "URL": "\/php\/api\/younow\/trendingTags"
    },
    "YOUNOW_TRENDING_USERS": {
        "DNS": "CDN",
        "URL": "\/php\/api\/younow\/trendingUsers"
    },
    "YOUNOW_USER": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/younow\/user"
    },
    "YOUNOW_VIPS": {
        "DNS": "CDN",
        "URL": "\/php\/api\/younow\/vips"
    },
    "YOUNOW_LB_TOP_BROADCASTERS": {
        "DNS": "CDN",
        "URL": "\/php\/api\/younow\/topBroadcastersLeaderboard"
    },
    "YOUNOW_LB_TOP_CREATORS": {
        "DNS": "CDN",
        "URL": "\/php\/api\/younow\/topCreatorsLeaderboard"
    },
    "YOUNOW_LB_EDITORS_CHOICE": {
        "DNS": "CDN",
        "URL": "\/php\/api\/younow\/topEditorsLeaderboard"
    },
    "YOUNOW_LB_TOP_SPENDERS": {
        "DNS": "CDN",
        "URL": "\/php\/api\/younow\/topSpendersLeaderboard"
    },
    "YOUNOW_TOP_LB_USERS": {
        "DNS": "CDN",
        "URL": "\/php\/api\/younow\/topOverallLeaderboard"
    },
    "YOUNOW_LB_TRENDING_MOMENTS": {
        "DNS": "CDN",
        "URL": "\/php\/api\/younow\/topTrendingMoments"
    },
    "YOUNOW_BROADCASTER_TIERS": {
        "DNS": "CDN",
        "URL": "\/php\/api\/younow\/broadcasterTiers"
    },
    "YOUNOW_CONTEST_LEADERBOARDS": {
        "DNS": "CDN",
        "URL": "\/php\/api\/younow\/contestLeaderboards"
    },
    "DO_ADMIN_ACTION": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/doAdminAction"
    },
    "GET_SNAPSHOT": {
        "DNS": "CDN",
        "URL": "\/php\/api\/getSnapshot"
    },
    "GET_USER_ACTIONS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/getUserActions"
    },
    "INSTAGRAM_AUTH": {
        "DNS": "DEFAULT",
        "URL": "\/instagramAuth.php"
    },
    "PARTNER_PAGE": {
        "DNS": "DEFAULT",
        "URL": "\/partners"
    },
    "PARTNER_FORM": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/channel\/partnerForm"
    },
    "RECENTLY_BROADCASTED": {
        "DNS": "DEFAULT",
        "URL": "\/recentlybroadcasted.php"
    },
    "TUMBLR_AUTH": {
        "DNS": "DEFAULT",
        "URL": "\/tumblrAuth.php"
    },
    "TWITTER_LOGIN": {
        "DNS": "DEFAULT",
        "URL": "\/twitterLogin.php"
    },
    "PUSHER_AUTH": {
        "DNS": "DEFAULT",
        "URL": "\/api\/pusherAuth.php"
    },
    "PUSHER_AUTH_DEDICATED": {
        "DNS": "DEFAULT",
        "URL": "\/api\/pusherAuthDedicated.php"
    },
    "SEND_ERROR_EVENT_MOBILE": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/sendErrorEventMobile"
    },
    "TRACKING": {
        "DNS": "TRACK",
        "URL": ""
    },
    "MOMENT_FEED": {
        "DNS": "API2",
        "URL": "\/php\/api\/moment\/feed"
    },
    "MOMENT_LIKE": {
        "DNS": "API2",
        "URL": "\/php\/api\/moment\/like"
    },
    "MOMENT_IS_LIKED": {
        "DNS": "API2",
        "URL": "\/php\/api\/moment\/isLiked"
    },
    "MOMENT_PAIDLIKED": {
        "DNS": "API2",
        "URL": "\/php\/api\/moment\/paidLiked"
    },
    "MOMENT_CREATE": {
        "DNS": "API2",
        "URL": "\/php\/api\/moment\/create"
    },
    "MOMENT_PROFILE": {
        "DNS": "CDN3",
        "URL": "\/php\/api\/moment\/profile"
    },
    "MOMENT_PLAYLIST": {
        "DNS": "HLS",
        "URL": "\/momentsplaylists\/dev"
    },
    "MOMENT_COLLECTION": {
        "DNS": "CDN3",
        "URL": "\/php\/api\/moment\/collection"
    },
    "MOMENT_VIEWED": {
        "DNS": "API2",
        "URL": "\/php\/api\/moment\/viewed"
    },
    "MOMENT_HIDE": {
        "DNS": "API2",
        "URL": "\/php\/api\/moment\/hide"
    },
    "MOMENT_COLLECTION_DELETE": {
        "DNS": "API2",
        "URL": "\/php\/api\/moment\/collectionDelete"
    },
    "MOMENT_DELETE": {
        "DNS": "API2",
        "URL": "\/php\/api\/moment\/delete"
    },
    "MOMENT_THUMB": {
        "DNS": "HLS",
        "URL": "\/momentsthumbs\/dev"
    },
    "MOMENT_FETCH": {
        "DNS": "CDN3",
        "URL": "\/php\/api\/moment\/fetch"
    },
    "MOMENT_LIKES": {
        "DNS": "CDN3",
        "URL": "\/php\/api\/moment\/likes"
    },
    "GEMS_CHECKOUT_REQUEST": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/gemsCheckout\/request"
    },
    "GEMS_CHECKOUT_STATUS": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/gemsCheckout\/status"
    },
    "GEMS_CHECKOUT_TOKEN": {
        "DNS": "DEFAULT",
        "URL": "\/php\/api\/gemsCheckout\/token"
    },
    "GEMS_CHECKOUT": {
        "DNS": "DEFAULT",
        "URL": "\/gems-checkout"
    }
};
function cmdAPI(settings, params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (settings.younow) {
                const trendings = yield younow.getTrendings();
                if (trendings.errorCode)
                    throw "getTrendings fail";
                module_log_1.log(`getTrendings result:${trendings.errorCode} users:${trendings.trending_users.length}`);
                let tag = trendings.trending_tags[0];
                let tagInfo = yield younow.getTagInfo(tag.tag);
                if (tagInfo.errorCode)
                    throw "getTagInfo fail";
                let user = tagInfo.queues[0].items[0];
                module_log_1.log(`getLiveBroadcastByUID:${yield younow.getLiveBroadcastByUID(user.userId).then(x => x.errorCode ? x.errorMsg : "OK", module_log_1.error)}`);
                module_log_1.log(`getLiveBroadcastByUsername:${yield younow.getLiveBroadcastByUsername(user.profile).then(x => x.errorCode ? x.errorMsg : "OK", module_log_1.error)}`);
                module_log_1.log(`getUserInfoByUID:${yield younow.getUserInfoByUID(user.userId).then(x => x.errorCode ? x.errorMsg : "OK", module_log_1.error)}`);
                module_log_1.log(`getTagInfo:${yield younow.getTagInfo(tag.tag).then(x => x.errorCode ? x.errorMsg : "OK", module_log_1.error)}`);
                module_log_1.log(`getMoments:${yield younow.getMoments(user.userId, 0).then(x => x.errorCode ? x.errorMsg : "OK", module_log_1.error)}`);
                module_log_1.log(`getPlaylist:${yield younow.getPlaylist(user.broadcastId)}`);
            }
        }
        catch (e) {
            module_log_1.error(e);
        }
    });
}
exports.cmdAPI = cmdAPI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kX2FwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2NtZF9hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLGtEQUFpRDtBQUNqRCxxREFBaUQ7QUFVakQsTUFBTSxNQUFNLEdBQ1o7SUFDQyxLQUFLLEVBQ0w7UUFDQyxLQUFLLEVBQUUsMEJBQTBCO1FBQ2pDLFNBQVMsRUFBRSw4QkFBOEI7UUFDekMsS0FBSyxFQUFFLDhCQUE4QjtRQUNyQyxVQUFVLEVBQUUsK0JBQStCO1FBQzNDLFVBQVUsRUFBRSwrQkFBK0I7UUFDM0MsT0FBTyxFQUFFLGdDQUFnQztRQUN6QyxTQUFTLEVBQUUsOEJBQThCO1FBQ3pDLEtBQUssRUFBRSwwQkFBMEI7UUFDakMsS0FBSyxFQUFFLDhCQUE4QjtRQUNyQyxNQUFNLEVBQUUsOEJBQThCO1FBQ3RDLE1BQU0sRUFBRSw4QkFBOEI7UUFDdEMsZ0JBQWdCLEVBQUUscUNBQXFDO0tBQ3ZEO0lBQ0QsZUFBZSxFQUNmO1FBQ0MsS0FBSyxFQUFFLFNBQVM7UUFDaEIsS0FBSyxFQUFFLDRCQUE0QjtLQUNuQztJQUNELG9CQUFvQixFQUNwQjtRQUNDLEtBQUssRUFBRSxTQUFTO1FBQ2hCLEtBQUssRUFBRSxpQ0FBaUM7S0FDeEM7SUFDRCx3QkFBd0IsRUFDeEI7UUFDQyxLQUFLLEVBQUUsS0FBSztRQUNaLEtBQUssRUFBRSxpQ0FBaUM7S0FDeEM7SUFDRCxnQkFBZ0IsRUFDaEI7UUFDQyxLQUFLLEVBQUUsU0FBUztRQUNoQixLQUFLLEVBQUUsNkJBQTZCO0tBQ3BDO0lBQ0Qsb0JBQW9CLEVBQ3BCO1FBQ0MsS0FBSyxFQUFFLFNBQVM7UUFDaEIsS0FBSyxFQUFFLGlDQUFpQztLQUN4QztJQUNELGdCQUFnQixFQUNoQjtRQUNDLEtBQUssRUFBRSxTQUFTO1FBQ2hCLEtBQUssRUFBRSw2QkFBNkI7S0FDcEM7SUFDRCwwQkFBMEIsRUFDMUI7UUFDQyxLQUFLLEVBQUUsU0FBUztRQUNoQixLQUFL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