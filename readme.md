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
- Copy ./config/config.sample.js to ./config/config.js and edit to suit your setup

Running
-------
- Start Mongo
- Start Memcache
- Set environment variables (or add them to the command line when starting the app)
  - [Memcache stuff](https://github.com/alevy/memjs#configuration)
- API keys
  - Each processing module will let you know what environment variables or criteria it needs on startup.
- Start the app `node .`

Deploying to production
-----------------------
- Edit `/etc/yum.conf` and add `proxy=http://proxy.osb.ft.com:8080` to the `[main]` section
<pre>
export http_proxy=proxy.osb.ft.com:8080
export https_proxy=proxy.osb.ft.com:8070
sudo yum install memcached.x86_64 nodejs npm.noarch nginx.x86_64 git make ruby rubygems.noarch mongodb-server.x86_64 mongoose-devel.x86_64 mongodb.x86_64
sudo chkconfig memcached on
sudo chkconfig mongod on
sudo chkconfig nginx on
sudo service mongod start; sudo service nginx start; sudo service memcached start
npm config set proxy http://proxy.osb.ft.com:8080
npm config set https-proxy http://proxy.osb.ft.com:8070
sudo npm config -g set proxy http://proxy.osb.ft.com:8080
sudo npm config -g set https-proxy http://proxy.osb.ft.com:8070
npm install
</pre>

Running in production
---------------------
- Use forever `NODE_ENV=production ./node_modules/forever/bin/forever start -o access.log -e error.log .`
- Flush memcache echo 'flush_all' | nc localhost 11211

Cron jobs
---------
```
# minute (0-59),
# |      hour (0-23),
# |      |       day of the month (1-31),
# |      |       |       month of the year (1-12),
# |      |       |       |       day of the week (0-6 with 0=Sunday).
# |      |       |       |       |       commands

  *     *       *       *       *       NODE_ENV=production node /apps/analytics-api/cron "minute" >> /apps/analytics-api/cron.log
  */10  *       *       *       *       NODE_ENV=production node /apps/analytics-api/cron "10 minutes" >> /apps/analytics-api/cron.log
  1     *       *       *       *       NODE_ENV=production node /apps/analytics-api/cron "hour" >> /apps/analytics-api/cron.log
  2     */2     *       *       *       NODE_ENV=production node /apps/analytics-api/cron "2 hours" >> /apps/analytics-api/cron.log
  2     */6     *       *       *       NODE_ENV=production node /apps/analytics-api/cron "6 hours" >> /apps/analytics-api/cron.log
  2     */12    *       *       *       NODE_ENV=production node /apps/analytics-api/cron "12 hours" >> /apps/analytics-api/cron.log
  4     8       *       *       *       NODE_ENV=production node /apps/analytics-api/cron "day" >> /apps/analytics-api/cron.log

  37    1       *       *       *       NODE_ENV=production node /apps/analytics-api/cron/clear_old_data.js 60 >> /apps/analytics-api/cron.log
```
