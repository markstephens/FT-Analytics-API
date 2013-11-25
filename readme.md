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
- Start the app `node app.js`

Deploying to production
-----------------------
- Edit `/etc/yum.conf` and add `proxy=http://proxy.osb.ft.com:8080` to the `[main]` section
<pre>
export http_proxy=proxy.osb.ft.com:8080
export https_proxy=proxy.osb.ft.com:8070
sudo yum install memcached.x86_64 nodejs npm.noarch nginx.x86_64 git postgresql.x86_64 postgresql-devel.x86_64 make ruby rubygems.noarch mongodb-server.x86_64 mongoose-devel.x86_64 mongodb.x86_64
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

 *	*	*	*	*	NODE_ENV=production node ~/FT-Analytics-API/cron.js "minute" >> ~/FT-Analytics-API/cron.log
 */10	*	*	*	*	NODE_ENV=production node ~/FT-Analytics-API/cron.js "10 minutes" >> ~/FT-Analytics-API/cron.log
 1	*	*	*	*	NODE_ENV=production node ~/FT-Analytics-API/cron.js "hour" >> ~/FT-Analytics-API/cron.log
 2	*/2	*	*	*	NODE_ENV=production node ~/FT-Analytics-API/cron.js "2 hours" >> ~/FT-Analytics-API/cron.log
 2	*/6	*	*	*	NODE_ENV=production node ~/FT-Analytics-API/cron.js "6 hours" >> ~/FT-Analytics-API/cron.log
 2	*/12	*	*	*	NODE_ENV=production node ~/FT-Analytics-API/cron.js "12 hours" >> ~/FT-Analytics-API/cron.log
 4	8	*	*	*	NODE_ENV=production node ~/FT-Analytics-API/cron.js "day" >> ~/FT-Analytics-API/cron.log

 37	1	*	*	*	NODE_ENV=production node ~/FT-Analytics-API/clear_old_data.js 60 >> ~/FT-Analytics-API/cron.log
```
