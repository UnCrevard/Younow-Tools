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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0X2V4YW1wbGUxLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc2NyaXB0X2V4YW1wbGUxLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVdBO0lBYUMsSUFBSSxHQUFHLEVBQ1A7UUFDQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLDRCQUE0QixDQUFDLEVBQy9DO1lBQ0MsT0FBTyxLQUFLLENBQUE7U0FDWjthQUVEO1lBQ0MsT0FBTyxJQUFJLENBQUE7U0FDWDtLQUNEO1NBNEJJLElBQUksSUFBSSxFQUNiO1FBQ0MsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQztZQUMxQyxJQUFJLENBQUMsTUFBTSxJQUFFLFFBQVEsRUFDdEI7WUFDQyxPQUFPLFFBQVEsQ0FBQTtTQUNmO2FBQ0ksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFDaEM7WUFDQyxPQUFPLFFBQVEsQ0FBQTtTQUNmO2FBQ0ksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFDLEVBQUUsRUFDdEM7WUFDQyxPQUFPLFNBQVMsQ0FBQTtTQUNoQjthQUNJLElBQUksU0FBUyxFQUNsQjtZQUNDLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0NBQW9DLENBQUMsRUFDakU7Z0JBQ0MsT0FBTyxRQUFRLENBQUE7YUFDZjtpQkFDSSxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUMsRUFBRSxFQUNwRTtnQkFDQyxPQUFPLFFBQVEsQ0FBQTthQUNmO2lCQUNJLElBQUksU0FBUyxDQUFDLGVBQWUsR0FBQyxFQUFFLEVBQ3JDO2dCQUNDLE9BQU8sUUFBUSxDQUFBO2FBQ2Y7aUJBQ0ksSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFDbEM7Z0JBQ0MsS0FBSyxJQUFJLE9BQU8sSUFBSSxTQUFTLENBQUMsUUFBUSxFQUN0QztvQkFDQyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLCtCQUErQixDQUFDLEVBQzFEO3dCQUNDLEdBQUcsQ0FBQyxXQUFXLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO3dCQUNqQyxPQUFPLFFBQVEsQ0FBQTtxQkFDZjtpQkFDRDthQUNEO2lCQUVEO2dCQUNDLE9BQU8sU0FBUyxDQUFBO2FBQ2hCO1NBQ0Q7YUFFRDtZQUNDLE9BQU8sU0FBUyxDQUFBO1NBQ2hCO0tBQ0Q7QUFDRixDQUFDO0FBRUQsSUFDQTtJQUNDLElBQUksRUFBRSxDQUFBO0NBQ047QUFDRCxPQUFNLENBQUMsRUFDUDtJQUNDLENBQUMsQ0FBQTtDQUNEIn0=