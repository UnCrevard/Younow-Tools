"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_www_1 = require("./modules/module_www");
const API_STORIES = "https://storysharing.snapchat.com";
function getStories(username) {
    let url = `${API_STORIES}/v1/fetch/${username}?request_origin=ORIGIN_WEB_PLAYER`;
    return module_www_1.getURL(url);
}
exports.getStories = getStories;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3NuYXBjaGF0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vbW9kdWxlX3NuYXBjaGF0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscURBQTZDO0FBRzdDLE1BQU0sV0FBVyxHQUFHLG1DQUFtQyxDQUFBO0FBT3ZELG9CQUEyQixRQUFnQjtJQUMxQyxJQUFJLEdBQUcsR0FBRyxHQUFHLFdBQVcsYUFBYSxRQUFRLG1DQUFtQyxDQUFBO0lBQ2hGLE9BQU8sbUJBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUNuQixDQUFDO0FBSEQsZ0NBR0MifQ==