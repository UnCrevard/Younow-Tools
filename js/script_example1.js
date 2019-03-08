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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0X2V4YW1wbGUxLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc2NyaXB0X2V4YW1wbGUxLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBYUE7SUFhQyxJQUFJLEdBQUcsRUFDUDtRQUNDLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsNEJBQTRCLENBQUMsRUFDL0M7WUFDQyxPQUFPLEtBQUssQ0FBQTtTQUNaO2FBRUQ7WUFDQyxPQUFPLElBQUksQ0FBQTtTQUNYO0tBQ0Q7U0E0QkksSUFBSSxJQUFJLEVBQ2I7UUFDQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDO1lBQzFDLElBQUksQ0FBQyxNQUFNLElBQUUsUUFBUSxFQUN0QjtZQUNDLE9BQU8sUUFBUSxDQUFBO1NBQ2Y7YUFDSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUNoQztZQUNDLE9BQU8sUUFBUSxDQUFBO1NBQ2Y7YUFDSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUMsRUFBRSxFQUN0QztZQUNDLE9BQU8sU0FBUyxDQUFBO1NBQ2hCO2FBQ0ksSUFBSSxTQUFTLEVBQ2xCO1lBQ0MsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxFQUNqRTtnQkFDQyxPQUFPLFFBQVEsQ0FBQTthQUNmO2lCQUNJLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBQyxFQUFFLEVBQ3BFO2dCQUNDLE9BQU8sUUFBUSxDQUFBO2FBQ2Y7aUJBQ0ksSUFBSSxTQUFTLENBQUMsZUFBZSxHQUFDLEVBQUUsRUFDckM7Z0JBQ0MsT0FBTyxRQUFRLENBQUE7YUFDZjtpQkFDSSxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUNsQztnQkFDQyxLQUFLLElBQUksT0FBTyxJQUFJLFNBQVMsQ0FBQyxRQUFRLEVBQ3RDO29CQUNDLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsK0JBQStCLENBQUMsRUFDMUQ7d0JBQ0MsR0FBRyxDQUFDLFdBQVcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7d0JBQ2pDLE9BQU8sUUFBUSxDQUFBO3FCQUNmO2lCQUNEO2FBQ0Q7aUJBRUQ7Z0JBQ0MsT0FBTyxTQUFTLENBQUE7YUFDaEI7U0FDRDthQUVEO1lBQ0MsT0FBTyxTQUFTLENBQUE7U0FDaEI7S0FDRDtBQUNGLENBQUM7QUFFRCxJQUNBO0lBQ0MsSUFBSSxFQUFFLENBQUE7Q0FDTjtBQUNELE9BQU0sQ0FBQyxFQUNQO0lBQ0MsQ0FBQyxDQUFBO0NBQ0QifQ==