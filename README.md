
# Vigilio Sources

This is a website to list all available Vigilio sources. 

Vigilio and this website rely on [mud-parser](https://www.npmjs.com/package/mud-parser)

I created this in 3 days so the features are limited.

## Features

* User create, login, logout
* Add new sources for Vigilio using Source creation tool.
* Check out example source and test various aspects of mud-parser.
* Preview of results with actual Vigilio search results.
* Thumbs up & thumbs down sources without registration.
* Thumbs up & thumbs down throttling with redis (falls back to local if fails).
* Anon and register user throttling.
* Source creation throttling with redis (falls back to local if fails).
* Aside of user registry and log operations, the site operates on single page react.

## Missing

* Source management (missing front-end).
* User password recovery flow.
