# posse-twitter

Publish (on your) Own Site, Syndicate Elsewhere microblogging.

![pic](https://i.cloudup.com/LAXz2TKvl6.png)

The "elsewhere" is currently twitter. I'll probably change the name of this repo to `posse-microblog` and have pluggable modules for syndication, `posse-microblog-twitter` and `posse-microblog-facebook`, for example.

This is super alpha stuff right now.

# Setup

* Go to http://dev.twitter.com and register an application to get your API credentials. Make sure you request Read, Write & DM privileges and generate your token.

* Copy `twitter-config.json.example` to `twitter-config.json` and fill out your API details.

* Oh yeah, database stuff. Schemas are in `sql/schemas.sql`

* Database credentials.

# TODO
* Mobile version! Figuring out reply-to is gonna be hard on mobile. I might have to go PESOS for mobile reply-to or give up that metadata.

* Optional lat & long for updates.

* Add links back to original when syndicating.

* Credentials! CREDENTIALSSSSSSsss

* Status display page

* Reply context on status display page

* Sorting in mysql-stream-db

* `createWriteStream` should be a through stream that re-emits rows when they have successfully written to the database. With that, we better chain together things with `map`s and `pipe`s.

* RSS feed
