"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function main() {
    if (tag) {
        if (tag.tag.match(/(turkish|arab|kuwait|guys)/)) {
            return false;
        }
        else {
            return true;
        }
    }
    else if (user) {
        if (user.profile.match(/(michael.jackson)/) ||
            user.userId == 12345678) {
            return "follow";
        }
        else if (user.l.match(/(me|tr)/)) {
            return "ignore";
        }
        else if (!broadcast && user.viewers > 50) {
            return "resolve";
        }
        else if (broadcast) {
            if (broadcast.country.match(/(OM|JO|EG|PK|PH|RO|TR|KW|SA|MA|TN)/)) {
                return "ignore";
            }
            else if (broadcast.country.match(/(US|GB|UK|IE)/) && user.viewers > 50) {
                return "follow";
            }
            else if (broadcast.broadcastsCount > 20) {
                return "ignore";
            }
            else if (broadcast.comments.length) {
                for (let comment of broadcast.comments) {
                    if (comment.comment.match(/(funny|hilarious|tremendous)/i)) {
                        log(`comment ${comment.comment}`);
                        return "follow";
                    }
                }
            }
            else {
                return "waiting";
            }
        }
        else {
            return "waiting";
        }
    }
}
try {
    main();
}
catch (e) {
    e;
}
//# sourceMappingURL=script_example1.js.map