"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_www_1 = require("../modules/module_www");
const API_STORIES = "https://storysharing.snapchat.com";
function getStories(username) {
    let url = `${API_STORIES}/v1/fetch/${username}?request_origin=ORIGIN_WEB_PLAYER`;
    return module_www_1.getURL(url);
}
exports.getStories = getStories;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3NuYXBjaGF0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbW9kdWxlcy9tb2R1bGVfc25hcGNoYXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzREFBOEM7QUFHOUMsTUFBTSxXQUFXLEdBQUcsbUNBQW1DLENBQUE7QUFPdkQsU0FBZ0IsVUFBVSxDQUFDLFFBQWdCO0lBQzFDLElBQUksR0FBRyxHQUFHLEdBQUcsV0FBVyxhQUFhLFFBQVEsbUNBQW1DLENBQUE7SUFDaEYsT0FBTyxtQkFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ25CLENBQUM7QUFIRCxnQ0FHQyJ9