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
const younow = require("./module_younow");
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
function cmdAPI() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const trendings = yield younow.getTrendings();
            if (trendings.errorCode)
                throw "getTrendings fail";
            module_log_1.log(`getTrendings result:${trendings.errorCode} users:${trendings.trending_users.length}`);
            let tag = trendings.trending_tags[0];
            let tagInfo = yield younow.getTagInfo(tag.tag);
            if (tagInfo.errorCode)
                throw "getTagInfo fail";
            let user = tagInfo.items[0];
            module_log_1.log(`getLiveBroadcastByUID:${yield younow.getLiveBroadcastByUID(user.userId).then(x => x.errorCode ? x.errorMsg : "OK", module_log_1.error)}`);
            module_log_1.log(`getLiveBroadcastByUsername:${yield younow.getLiveBroadcastByUsername(user.profile).then(x => x.errorCode ? x.errorMsg : "OK", module_log_1.error)}`);
            module_log_1.log(`getUserInfoByUID:${yield younow.getUserInfoByUID(user.userId).then(x => x.errorCode ? x.errorMsg : "OK", module_log_1.error)}`);
            module_log_1.log(`getTagInfo:${yield younow.getTagInfo(tag.tag).then(x => x.errorCode ? x.errorMsg : "OK", module_log_1.error)}`);
            module_log_1.log(`getMoments:${yield younow.getMoments(user.userId, 0).then(x => x.errorCode ? x.errorMsg : "OK", module_log_1.error)}`);
            module_log_1.log(`getPlaylist:${yield younow.getPlaylist(user.broadcastId)}`);
        }
        catch (e) {
            module_log_1.error(e);
        }
    });
}
exports.cmdAPI = cmdAPI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kX2FwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2NtZF9hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDBDQUF5QztBQUN6QyxxREFBaUQ7QUFVakQsTUFBTSxNQUFNLEdBQ1g7SUFDQyxLQUFLLEVBQ0o7UUFDQyxLQUFLLEVBQUUsMEJBQTBCO1FBQ2pDLFNBQVMsRUFBRSw4QkFBOEI7UUFDekMsS0FBSyxFQUFFLDhCQUE4QjtRQUNyQyxVQUFVLEVBQUUsK0JBQStCO1FBQzNDLFVBQVUsRUFBRSwrQkFBK0I7UUFDM0MsT0FBTyxFQUFFLGdDQUFnQztRQUN6QyxTQUFTLEVBQUUsOEJBQThCO1FBQ3pDLEtBQUssRUFBRSwwQkFBMEI7UUFDakMsS0FBSyxFQUFFLDhCQUE4QjtRQUNyQyxNQUFNLEVBQUUsOEJBQThCO1FBQ3RDLE1BQU0sRUFBRSw4QkFBOEI7UUFDdEMsZ0JBQWdCLEVBQUUscUNBQXFDO0tBQ3ZEO0lBQ0YsZUFBZSxFQUNkO1FBQ0MsS0FBSyxFQUFFLFNBQVM7UUFDaEIsS0FBSyxFQUFFLDRCQUE0QjtLQUNuQztJQUNGLG9CQUFvQixFQUNuQjtRQUNDLEtBQUssRUFBRSxTQUFTO1FBQ2hCLEtBQUssRUFBRSxpQ0FBaUM7S0FDeEM7SUFDRix3QkFBd0IsRUFDdkI7UUFDQyxLQUFLLEVBQUUsS0FBSztRQUNaLEtBQUssRUFBRSxpQ0FBaUM7S0FDeEM7SUFDRixnQkFBZ0IsRUFDZjtRQUNDLEtBQUssRUFBRSxTQUFTO1FBQ2hCLEtBQUssRUFBRSw2QkFBNkI7S0FDcEM7SUFDRixvQkFBb0IsRUFDbkI7UUFDQyxLQUFLLEVBQUUsU0FBUztRQUNoQixLQUFLLEVBQUUsaUNBQWlDO0tBQ3hDO0lBQ0YsZ0JBQWdCLEVBQ2Y7UUFDQyxLQUFLLEVBQUUsU0FBUztRQUNoQixLQUFLLEVBQUUsNkJBQTZCO0tBQ3BDO0lBQ0YsMEJBQTBCLEVBQ3pCO1FBQ0MsS0FBSyxFQUFFLFNBQVM7UUFDaEIsS0FBSyxF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