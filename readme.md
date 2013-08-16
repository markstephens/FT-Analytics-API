FT Analytics API
================

An API of Analytics data. Data can be collected in many formats and served in a consistant way. Historical data can be stored.

Requirements
------------
- node.js
- mongoDB
- MemCache

Installation
------------
- Install Mongo, Memcache and Node.js
- Clone this repo `git clone ...`
- run `npm install`

Running
-------
- Set environment variables (or add them to the command line when starting the app)
  - TODO: Mongo stuff
  - TODO: Memcache stuff
  - TODO: API keys stuff
- Start Mongo
- Start Memcache
- Start the app `node app`

Deploying to production
-----------------------
- [This looks a good start ](http://blog.argteam.com/coding/hardening-node-js-for-production-part-2-using-nginx-to-avoid-node-js-load/)
- Otherwise, as above, but stick a `NODE_ENV=production` in there e.g `NODE_ENV=production; node app`
