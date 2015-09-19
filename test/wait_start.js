#!/usr/bin/env node

// Usage:
// - Start rtc_server.js first:
//   ./rtc_server.js --port 8000 --home chat.html
//
// - Now run the test using the rtc_server listen address and the
//   number of nodes:
//     node test/wait_start.js 10.0.01:8001 3

var RtcTwst = require('./rtctwst').RtcTwst,
    rtwst = new RtcTwst(),
    rtc_address = process.argv[2],
    clientCount = process.argv.length >= 4 ? parseInt(process.argv[3]) : 1,
    timeout = (clientCount*20)*1000;

var channel = Math.round(Math.random()*100000);
var url = 'http://' + rtc_address +
          '/chat.html?channel=' + channel +
          '&twst_address=' + rtwst.getAddress() + '&paused=1';

var pages = [];

for (var i=0; i<clientCount; i++) {
    pages.push(rtwst.dockerPage(url, {prefix: 'p' + i + ': ',
                                      timeout: timeout}));
}

function poll() {
    if (Object.keys(rtwst.clients).length >= clientCount) {
        console.log('Delaying for 5 seconds before starting cluster');
        setTimeout(do_start, 5000);
    } else {
        setTimeout(poll, 100);
    }
}

function do_start() {
    rtwst.broadcast('start();');
    rtwst.wait_cluster_up(timeout, function(status, nodes, elapsed) {
        if (status) {
            console.log('Cluster is up after ' + elapsed + 'ms');
            console.log('Delaying for 3 seconds before sending message');
            rtwst.cleanup_exit(0);
        } else {
            console.log('Cluster failed to come up after ' +
                        elapsed + 'ms');
            rtwst.cleanup_exit(1);
        }
    });
}

poll();


setTimeout(function() {
    console.log("timeout waiting for clients");
    rtwst.broadcast('window.callPhantom("QUIT")');
    rtwst.cleanup_exit(1);
}, timeout);