# Younow-Tools

## Installation

1st you need to install  [NodeJS](https://nodejs.org/en/download/current/) download and install the LTS or Current.

Then launch your terminal (cmd.exe on windows) and install Younow-Tools with NPM :

	npm install -g younow-tools

The command **younow** will be available in your console (cmd.exe or powershell.exe or bash)

To update younow-tools just type :

	npm update -g

### Change log

20180610/1.0.31

	fix a lowercase problem on linux (thx to torqueyy)
	add bc shortcut for broadcast
	fix API hostname
	😂 Younow forgot to renew their ssl certificate 😂

20180528/1.0.30

	check for ffmpeg installation 
	check for update
	fix issues with ffmpeg & api changes

20180523/1.0.29

	urgent : Using rtmp stream now (HLS has been removed from Younow Website = Flash Only) so **FFMPEG is mandatory now**. You can get it from https://ffmpeg.zeranoe.com/builds/

	*rewind is unavailable with rtmp*. 
20170504

	fix : linux compatibility 
20170506

	add : option --locale 
20170507

	add : command follow 
20170510

	add : command followed & fix follow "soon..." 

## Summary

This package offer various tools to use Younow via cli. Type younow for basic usage.

User(s) as profile name (string) or userId (number) or profile URL are supported.

Every broadcast are recorded from the beginning, even if you catch the record at the end. So the downloader will (very quickly) download the the entire broadcast.

The database location by default is in your user folder (%APPDATA%/YounowTools/broadcasters.txt on windows / Linux $HOME/YounowTools)

Ctrl-C to stop at any time.

## Commands

### follow <users>

Record broadcasts followed (aka FanOf on profile page) from any user(s) or your account.

Default interval is 5 minutes (it's every minute on the website). Use --timer to change this value.

```
younow -t 3 follow your_account someone_with_good_taste
```

### add

Add broadcaster(s) to your local database :

* for faster resolve
* database query
* record their live broadcasts (scan mode)

```
younow add user 1234 https://www.younow.com/user
```

### remove

Remove user(s) from your database (removed but not ignored)

	younow remove 1234 somebody

### ignore

Ignore/unignore broadcasters when they're broadcasting

### note

Add an annotation (comment) to a broadcaster in the database. Must be quoted

	younow note somebody "really funny"

### search

Search in the database for one or multiple regex pattern/string in all properties

	younow search sn.pch.t dude sexy https instagram funny youtube

### resolve

Resolve broadcasters(s) and display some informations without adding them to the database

	younow resolve someone 12345 https://younow.com/user

### followed

List the followed (fanOf on profile page) of any user(s)

### vcr <user(s)>

Try to download (if moments are enabled) past broadcast of a broadcaster.

### live <user(s)>

Record a running broadcast user(s) (error 206 means broadcast is over)

### broadcast <bid(s)...>

Download broadcast(s) by its ID (number)

### scan [-t interval] <javascript_script>

-t number : scan interval in minute (default every 5 minutes)
javascript_script : a javascript to analyze live broadcasters

examples :

[basic](https://github.com/UnCrevard/Younow-Tools/blob/master/js/script_example2.js)
[complex](https://github.com/UnCrevard/Younow-Tools/blob/master/js/script_example1.js)

	younow -t 3 --dl z:\ --mv w:\ script.js

### api

check api compatibility (advanced)

### fixdb

compact/normalize your database (advanced)

### debug

ignore this (advanced)

## Options

### --locale <locale>

Use a different locale for request. Default is en (english).

### --config <path>

Change default config location for database and data.

### --dl <path>

Change default download folder (current path is the default)

### --nodl (advanced)

Execute commands (vcr, scan, broadcast, live) without downloading

### -l --limit <number>

Number of parallel downloads for a stream (default 5).
Don't abuse or a stream can be broken (500 server protection)

### --mv <path>

Move files (stream/thumbnail/informations) at the end of the broadcast to this folder (default is do nothing)

### -v --verbose

Increase verbosity level (all commands)

-v basic messages (in blue)
-vv debug messages (in green) network
-vvv dump json requests

### --fmt videoformat

Set the video output format (use FFMPEG)

	younow --fmt mp4 scan script.js
	younow --fmt mkv vcr user

MP4 will add "-bsf:a aac_adtstoasc" for compatibility

default FFMPEG args are :

-hide_banner // no banner
-loglevel error // silence
-c copy // copy stream without reencoding
-video_track_timescale 0 // some broadcasters need this (corrupted videos)

**FFMPEG MUST BE IN YOUR PATH (on Windows) OR INSTALLED (on Linux)**

### --ffmpeg commandLine (advanced)

Use ffmpeg to encode the video.

	younow --fmt mkv --ffmpeg "-s 320x240 -r 30 -an" vcr user
	younow --fmt avi --ffmpeg "-vcodec libxvid -acodec libmp3lame" scan script.js

**FFMPEG MUST BE IN YOUR PATH (on Windows) OR INSTALLED (on Linux)**

	younow -v add user

### -h --help

Guess what ?

## How to script ?!

Your script is called for every new tag or broadcasters on line and it decides to trigger or not the recording/ignoring/resolving == FILTERING

The script is sand-boxed and only has access to basic javascript (no network, no disk, etc...). Some knowledge of basic javascript is needed.

(some scripts are available in the source folder)

The script receives the log variable. it's a function than the script can use to print some message.

1st it will receive the tag variable (object) :

	tag.tag : name of the tag (string)
	tag.score : score of the tag (float 0 to 10)

	The script must returns true or false to accept or reject the tag (ignore).

	Basic tag filter :

```javascript
if (tag) // first check if it needs to scan/ignore a tag
{
	if (tag=="music")
	{
log("make some noise !")
		true // yeah music
	}
	else
	{
		false // ignore all other tags
	}
}
```
Advanced tag filter :
```javascript
if (tag)
{
	if (tag.score<5) // ignore non popular tag
	{
		false // ignore this tag
	}
	else if (tag.match(/(music|funny|piano|singing)/i)) // tag match some key word ?
	{
		true // scan this tag
	}
	else
	{
		false // ignore the rest
	}
}
```

2nd call it will receive the user variable (tag is now null)

	user.profile : profile name (string)
	user.userId : user id (number)
	user.userlevel : user level
	user.l : language en es me de tr
	user.viewers : watchers
	user.likes : current broadcast likes
	user.fans : current broadcast fans
	user.totalFans : all broadcasts fans
	user.position : current position (0 to 100)

```javascript
// Basic script :

if (tag)
{
	// handle tags...
	true // include all
}
else if (user)
{
	if (user.viewers<50)
	{
		"ignore" // ignore broadcasts with less than 50 viewers
	}
	else if (user.l.match(/(me|de|tr|es)/i))
	{
		"ignore" // ignore non english languages
	}
	else if (user.userId==1234 || user.profile=="yeahhhhhhh")
	{
		log("your favorite broadcaster is online !")
		"follow" // record these broadcasts
	}
	else if (user.position>50)
	{
		log(user.profile,"seems to be popular !")
		"resolve" // request more informations for this broadcaster (3rd pass)
	}
	else
	{
		log("I'm bored")
		"waiting" // wait for broadcast to match some values
	}
}
```

3rd call it will receive the user and the broadcast variables (tag is null)
When the script returns resolve it will receive informations on the broadcast (LiveBroadcast Object)
This variable exports more information on a current broadcast than the user one.

(for more the list and some informations on all properties of this object check for the source file Younow-tools.d.ts)

At least the final script to handle various broadcast parameters :

```javascript
if (tag)
{
	true // accept all tags
}
else if (user)
{
	if (user.viewers<50)
	{
		"ignore"
	}
	else if (broadcast) // if resolved
	{
		if (broadcast.country.match(/(OM|JO|EG|PK|PH|RO|TR|KW|SA|MA|TN)/))
		{
			return "ignore" // ignore some countries...
		}
		else if (broadcast.country.match(/(AU|GB|US|UK|IE)/)) // only English spoken
		{
			if (broadcast.broadcastsCount<20) // ignore newbies
			{
				return "ignore"
			}
			else
			{
				log("Interesting broadcast",user.profile)
				"resolve"
			}
		else
		{
			return "waiting"
		}
	}
	else
	{
		"resolve" // request more informations
	}
}
```

# WARNING !

They're hundred of broadcasts every minutes so a wrong filtering can fill you hard drive and saturate your network bandwidth very quickly !

The script receive 4 variables :
```javascript
declare var tag:Younow.Tag
declare var user:Younow.TagInfoUser
declare var broadcast:Younow.LiveBroadcast
declare var log:any
```

# Tips !

userId == channelId and profile=profileUrlString

userId is more reliable than the profile name to identify a broadcaster because it can't be changed

REWIND => The broadcast is live and beginning is actually downloaded
WATCH => The broadcast is running & downloaded

Sometimes the stream timestamps are corrupt and can be read smoothly (server side bug). FFMPEG can be used to repair those files :

```
ffmpeg.exe, -i video_file.ts -c copy -video_track_timescale 0 fixed_video.ts
```

## Comments

To compile the source (.ts) you need typescript (VSCode or Atom editor) and share your scripts ^.^

**As an open source project use it at your own risk. Younow can break it down at any time.**

Report any bug or missing feature at your will.

If you like this software, please consider a Bitcoin donation to bitcoin:// 	14bpqrNgreKaFtLaK85ArtcUKyAxuKpwJM

# Enjoy !
