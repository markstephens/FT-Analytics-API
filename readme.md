FT Analytics API
================

An API of Analytics data. Data can be collected in many formats and served in a consistent way. Historical data can be stored.

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
- Start Mongo
- Start Memcache
- Set environment variables (or add them to the command line when starting the app)
  - [Memcache stuff](https://github.com/alevy/memjs#configuration)
- API keys
  - Each processing module will let you know what environment variables or criteria it needs on startup.
- Start the app `NODE_ENV=production PORT=5000 ./node_modules/forever/bin/forever start app.js`

Deploying to production
-----------------------
- [This looks a good start ](http://blog.argteam.com/coding/hardening-node-js-for-production-part-2-using-nginx-to-avoid-node-js-load/)
- Otherwise, as above, but stick a `NODE_ENV=production` in there e.g `NODE_ENV=production; node app`
