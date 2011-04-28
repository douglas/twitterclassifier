#!/bin/sh
echo "start stream and proxy on 8080 and 8001"
node stream.js;node clsproxy.js
