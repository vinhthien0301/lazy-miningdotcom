#!/bin/sh

forever stop lazy-miningdotcom
rm -rf ~/.forever/lazy-miningdotcom.log.previous
mv ~/.forever/lazy-miningdotcom.log lazy-miningdotcom.log.previous
forever --uid lazy-miningdotcom -o out.server -e error.server start app.js
forever list
tail -f ~/.forever/lazy-miningdotcom.log