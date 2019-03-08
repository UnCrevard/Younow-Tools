export {}

declare var tag:Younow.Tag
declare var user:Younow.TagInfoUser
declare var broadcast:Younow.LiveBroadcast
declare var log:any

/**
 *
 * you can't use return at 1st level. create a function or something.
 *
 *
 */
if (tag)
{
	true // all tags
}
else if (user)
{
	if (user.viewers>100)
	{
		"follow"
	}
	else
	{
		"waiting"
	}
}
