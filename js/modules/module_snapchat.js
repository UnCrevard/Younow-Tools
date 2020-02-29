"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_www_1 = require("../modules/module_www");
const API_STORIES = "https://storysharing.snapchat.com";
function getStories(username) {
    let url = `${API_STORIES}/v1/fetch/${username}?request_origin=ORIGIN_WEB_PLAYER`;
    return module_www_1.getURL(url);
}
exports.getStories = getStories;
//# sourceMappingURL=module_snapchat.js.map