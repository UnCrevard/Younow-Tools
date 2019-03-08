export {}

declare var tag:Younow.Tag
declare var user:Younow.TagInfoUser
declare var broadcast:Younow.LiveBroadcast
declare var log:any

/*

	sample script to filtering live broadcast (sandboxed : only javascript code & no network/disk access)

*/

function main()
{
	/*
		1st pass : include a tag yes or no

		param : tag=TagInfo

			tag.tag:tagname
			tag.score:tag ranking

		return : true or false
	*/

	if (tag)
	{
		if (tag.tag.match(/(turkish|arab|kuwait|guys)/))
		{
			return false // ignore this tag
		}
		else
		{
			return true // load tag
		}
	}
	/*
		2nd pass :

			user=TagInfoUser
			broadcast:UserBroadcastInfo // null before answer "resolve" (3rd pass)

			user.profile : profile name (string)
			user.userId : user id (number)
			user.userlevel : user level
			user.l : language en es me de tr
			user.viewers : watchers
			user.likes : current broadcast likes
			user.fans : current broadcast fans
			user.totalFans : all broadcasts fans
			user.position : current position (0 to 100)

			broadcast.broadcastsCount
			broadcast.country : country code US GB AU DE

			return : the script must returns one of theses values

			follow : record the broadcaster
			ignore : ignore the broadcaster
			resolve: request more data from the server (country & broadcastsCount)
			null|undefined|false|true|whatever : don't request more data (faster)

	*/
	else if (user)
	{
		if (user.profile.match(/(michael.jackson)/) || // match user profile name with regex
			user.userId==12345678) // match user id
		{
			return "follow"
		}
		else if (user.l.match(/(me|tr)/)) // language match arabic or turk
		{
			return "ignore"
		}
		else if (!broadcast && user.viewers>50)
		{
			return "resolve" // request UserBroadcastInfo
		}
		else if (broadcast)
		{
			if (broadcast.country.match(/(OM|JO|EG|PK|PH|RO|TR|KW|SA|MA|TN)/))
			{
				return "ignore"
			}
			else if (broadcast.country.match(/(US|GB|UK|IE)/) && user.viewers>50)
			{
				return "follow"
			}
			else if (broadcast.broadcastsCount>20)
			{
				return "ignore"
			}
			else if (broadcast.comments.length)
			{
				for (let comment of broadcast.comments)
				{
					if (comment.comment.match(/(funny|hilarious|tremendous)/i))
					{
						log(`comment ${comment.comment}`)
						return "follow"
					}
				}
			}
			else
			{
				return "waiting"
			}
		}
		else
		{
			return "waiting"
		}
	}
}

try
{
	main()
}
catch(e)
{
	e
}
