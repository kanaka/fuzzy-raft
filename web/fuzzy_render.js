// String format function: http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format/4673436#4673436
if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match;
        });
    };
}

function padNum(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

// Parse query parameters
if (!location.queryParams) {
    location.queryParams = {};
    location.search.substr(1).split("&").forEach(function (param) {
        if (param === "") return;
        var key_value = param.split("=");
        location.queryParams[key_value[0]] = key_value[1] &&
            decodeURIComponent(key_value[1].replace(/\+/g, " "));
    });
}


(function() {

var $D = function(id) { return document.getElementById(id) };

console.log
var query = location.search,
    clusterSize = query ? parseInt(query.substr(1)) : 5,
    width = 500, height = 500;

var nodes = [], links = [];

var stepButton = $D('stepButton'),
    taskList = $D('taskList'),
    messages = $D('messages');


var node_template = '\
<div class="name">{0} <input id="reset{6}" type="button" value="Reset" /></div>\
<div class="state">{1}</div>\
<div class="term">{2}</div>\
<div class="log">Log - {3} / {4}</div>\
<div class="etimer">ET <input type="number" value="{5}" disabled /></div>';

//
// d3.js specific
//

// Size the svg area for displaying the links
var svg = d3.select('#svg')
    .attr('width', width)
    .attr('height', height);

// Size the div area for displaying the nodes
var divs = d3.select('#divs')
    .attr('style', function(d) { return 'width: ' + width + 'px; height: ' + height + 'px;'; });

// Per-type markers, as they don't inherit styles.
svg.append("svg:defs").selectAll("marker")
    .data(["plain", "green", "dashed", "red"])
.enter().append("svg:marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 5)
    //.attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
.append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

var force = d3.layout.force()
    .nodes(nodes)
    .links(links)
    .size([width, height])
    .linkDistance(function(l) {
        var len = nodes.length,
            sid = parseInt(l.source.id),
            tid = parseInt(l.target.id),
            dist1 = Math.abs(sid-tid),
            dist2 = (Math.min(sid,tid)+len)-Math.max(sid,tid),
            dist = Math.min(dist1, dist2);
        //console.log("link:", l.source.id, l.target.id, len, dist);
        return 900/len * dist;
    })
    //.linkStrength(0.8)
    .charge(-300)
    //.gravity(0.9)
    .on("tick", tick);

var path = svg.append("svg:g").selectAll("path"),
    label = svg.selectAll("text"),
    node = divs.selectAll(".node");

function tick() {
    if (!node[0][0]) {
        return;
    }

    var ox = node[0][0].offsetWidth / 2,
        oy = node[0][0].offsetHeight / 2;

    node.attr('style', function(d) {
        return 'left: ' + (d.x - ox) + 'px; top: ' + (d.y - oy) + 'px;';
    });

    path.attr("d", function(d) {
        var tx = d.target.x,
            ty = d.target.y,
            sx = d.source.x,
            sy = d.source.y;
        if (d.type === "dashed") {
            return [
                "M",sx,sy,
                "L",tx,ty,
            ].join(" ");
        } else {
            return [
                "M",sx,sy,
                "L",(sx+tx)/2,(sy+ty)/2
            ].join(" ");
        }
    });

    label.attr("x", function(d) {
                //return (d.source.x*2 + d.target.x)/3;
                return (d.source.x*1.5 + d.target.x)/2.5;
            })
         .attr("y", function(d) {
                //return (d.source.y*2 + d.target.y)/3;
                return (d.source.y*1.5 + d.target.y)/2.5;
            });
}

function updateD3() {
    // Links (connections and RPCs)
    path = path.data(force.links());
    // Add
    path.enter().append("svg:path");
    path.attr("class", function(d) { return "link " + d.type; })
        .attr("marker-end", function(d) {
                if (d.type === "dashed") {
                    return "";
                } else {
                    return "url(#" + d.type + ")";
                }
            });
    // Remove
    path.exit().remove();


    // Links (connections and RPCs)
    label = label.data(force.links());
    // Add
    label.enter().append("text");
    label.attr("font-size", "0.75em")
         .attr("fill", "black")
         .text(function (d) {
            if (!d.task || !'rpc' in d.task.data) { return ""; }
            var tdata = d.task.data, targs = tdata.args,
                txt = tdata.rpc;
            switch (tdata.rpc + "_" + tdata.type) {
            case 'requestVote_RPC':
                txt += " (" + targs.term;
                txt += "," + targs.candidateId;
                txt += "," + targs.lastLogIndex;
                txt += "," + targs.lastLogTerm + ")";
                break;
            case 'appendEntries_RPC':
                txt += " (" + targs.term;
                txt += "," + targs.leaderId;
                txt += "," + targs.prevLogIndex;
                txt += "," + targs.prevLogTerm;
                txt += ",{" + targs.entries.length + "}";
                txt += "," + targs.commitIndex + ")";
                break;
            case 'requestVote_RPC_Response':
                txt += " Rsp (" + targs.term;
                txt += "," + targs.voteGranted + ")";
                break;
            case 'appendEntries_RPC_Response':
                txt += " Rsp (" + targs.term;
                txt += "," + targs.success + ")";
                break;
            }
            return txt;
        })
    // Remove
    label.exit().remove();



    // Nodes
    node = node.data(force.nodes());
    // Add
    node.enter().append("div")
        .attr("id", function(d) { return "node" + d.id; })
        .call(force.drag);
    // Update
    node.attr("class", function(d) {
                    return "node " + d.state;
                })
        .html(function (d) {
                var id = d.id;

                return node_template.format(
                    d.serverMap[id], d.state, "T" + d.currentTerm,
                    d.commitIndex+1, d.log.length,
                    d.opts.electionTimeout, id);
            });
    for (var k=0; k < node[0].length; k++) {
        var button = document.getElementById("reset"+k);
        button.onclick = (function() {
            var id = k;
            return function() { resetNode(id); }
        })();
    }
    //node.on("click", resetNode);
    // Remove
    node.exit().remove();

    force.start();
}

function updateTasks() {
    while (taskList.firstChild) {
          taskList.removeChild(taskList.firstChild);
    }
    var tasks = tqueue.dump();
    for (var i=0; i < tasks.length; i++) {
        var li = document.createElement('li');
        var t = tasks[i],
            d = t.data,
            time = padNum(t.time, 4, "0"),
            msg;
        msg = t.id + "@" + time + "ms: " + " [" + d.id;
        if (d.rpc) { msg += " " + d.rpc; }
        msg += " " + d.type + "]";
        if (d.desc) { msg += " " + d.desc; }
        li.innerHTML = msg;
        taskList.appendChild(li);
    }
}

// Register callback functions to monitor changes to the task queue
tqueueOpts.scheduleCallback = function(task) {
    if (task.data.rpc) {
        var src = serverPool[task.data.src]._self,
            dst = serverPool[task.data.dst]._self,
            type;
        if (task.data.type === 'RPC') {
            type = "green";
        } else {
            type = "red";
        }
        links.push({task_id: task.id,
                    task: task,
                    type: type,
                    source: src,
                    target: dst});
        //console.log("schedule RPC:", task);
    }
};
tqueueOpts.finishCallback = function(task) {
    if (task.data.rpc) {
        //console.log("finish RPC:", task);
        for (var i = links.length-1; i >= 0; i--) {
            if (links[i].task_id === task.id) {
                links.splice(i, 1);
                break;
            }
        }
    }
};
tqueueOpts.cancelCallback = tqueueOpts.finishCallback;


////////////////////////////////////////////////////////////

function rpcLatencyFn() {
    var min = parseInt($D('rpcLatencyMin').value, 10),
        _max = parseInt($D('rpcLatencyMax').value, 10),
        max = (_max >= min ? _max : min),
        ms = Math.floor(Math.random() * (max - min + 1)) + min;
    return ms;
}

function saveLatencyFn() {
    return 20;
}

function msgFn(msg) {
    messages.innerHTML += msg + "\n";
    messages.scrollTop = messages.scrollHeight;
}

var startOpts = {debug: true,
                 verbose: 1,
                 currentTime: tqueue.currentTime,
                 requestVoteCallback: rpcCallback,
                 requestVoteResponseCallback: rpcCallback,
                 appendEntriesCallback: rpcCallback,
                 appendEntriesResponseCallback: rpcCallback,
                 rpcLatencyFn: rpcLatencyFn,
                 saveLatencyFn: saveLatencyFn};

startServers(startOpts, clusterSize, msgFn);

// Populate the nodes from the serverPool
for (var k in serverPool) {
    nodes.push(serverPool[k]._self);
}

// Populate the fully interconnected dashed lines
for (var i=0; i < nodes.length; i++) {
    for (var j=i+1; j < nodes.length; j++) {
        links.push({source:nodes[i], target:nodes[j], type:"dashed"});
    }
}

// Dynamic leader heartbeat / election timer

// 100 most recent oneway ping times for each node
var rpcLatencies = {};
var defuzzedVals = [];
for (var i=0; i<Object.keys(serverPool).length; i++) {
    rpcLatencies[i] = [];
    defuzzedVals[i] = '___';
}

function resetNode(id) {
    console.log("resetNode:", id);
    serverPool[id]._step_down();
    serverPool[id]._reset_election_timer();
    updateTasks();
    updateD3();
}

var chartTicks = [];
var chartData = [];
for(var x=1.0; x<3.1; x+=0.1) {
    chartTicks.push(x.toFixed(3));
    chartData = [[]];
}
graph.lineChart($D('canvas0'), chartTicks, chartData);

function rpcCallback(self, data) {
    //console.log("rpcCallback:", self, data);
    var id = self.id;

    rpcLatencies[id].push(tqueue.currentTime() - data.time);
    while (rpcLatencies[id].length > 100) {rpcLatencies[id].shift()}

    var loglen = self.log.length,
        prev_entry = loglen >= 20 ? self.log[loglen-20] : self.log[0],
        term_delta = self.log[loglen-1].term - prev_entry.term,
        cluster_size = Object.keys(serverPool).length;
        infer_fn = fuzzy.infer(term_delta, cluster_size),
        defuzzed = fuzzy.defuzzify(infer_fn),
        latencies = rpcLatencies[id],
        tot_latency = latencies.reduce(function(a,b) {return a+b}),
        avg_latency = tot_latency/latencies.length,
        // set the election timer to the roundtrip latency (2X)
        // multiplied by the defuzzified fuzzy coefficient value
        heartbeat_time = parseInt(defuzzed * 2 * avg_latency);

    // Update the values
    self.opts.heartbeatTime = heartbeat_time;
    self.opts.electionTimeout = heartbeat_time * 5;
    //console.log("rpcLatencies:", JSON.stringify(rpcLatencies[id]));
    //console.log("id:", self.id, "term_delta:", term_delta,
    //            "cluster_size:", cluster_size);
    //console.log("avg latency:", avg_latency,
    //            "defuzzed val:", defuzzed);
    //console.log("heartbeatTime:", heartbeat_time,
    //            "electionTimeout:", heartbeat_time * 5);

    // Update chart data and refresh the chart
    chartData[id] = chartTicks.map(infer_fn);
    graph.lineChart($D('canvas0'), chartTicks, chartData);
    defuzzedVals[id] = defuzzed.toFixed(2);

    var dspan = $D('defuzzy');
    dspan.innerHTML = defuzzedVals.join("&nbsp;&nbsp;");
}

////////////////////////

var stepsPending = 0;
function doSteps() {
    tqueue.step();
    updateTasks();
    updateD3();
    stepsPending -= 1;
    if (stepsPending > 0) {
        var ms = parseInt(1000 / $D('stepsPerSecond').value, 10);
        setTimeout(doSteps, ms);
    }
}

stepButton.onclick = function () {
    stepsPending = parseInt(document.getElementById('stepAmount').value);
    doSteps();
};

document.onkeyup = function (e) {
    if ((e.keyCode === 39) || (e.keyCode === 40)) {
        doSteps();
        e.stopPropagation();
        return false;
    } else if (e.keyCode === 13) {
        stepsPending = parseInt(document.getElementById('stepAmount').value);
        doSteps();
        e.stopPropagation();
        return false;
    }
    return true;
}

updateTasks();
updateD3();

})();
