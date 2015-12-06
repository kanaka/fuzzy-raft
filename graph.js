#!/usr/bin/env node

"use strict"

if (typeof module === 'undefined') {
    var fuzzy = {},
        exports = fuzzy
}

var Canvas = require('canvas'),
    Chart = require('nchart'),
    fs = require('fs');

var colors = [
    "151,187,205",
    "187,205,151",
    "205,151,187",
    "151,205,187",
    "205,187,151",
    "187,151,205",
    "255,151,255",
    "192,255,128",
    "255,192,128",
    "220,220,220"];

function line(file, labels, data, opts) {
    var canvas = new Canvas(800, 800),
        ctx = canvas.getContext('2d'),
        lopts = {
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            bezierCurve : false
        },
        datasets = [];

    for (var o in opts) {
        lopts[o] = opts[o]
    }

    for (var i=0; i<data.length; i++) {
        var color = colors[i];
        datasets.push({
            fillColor: "rgba("+color+",0.2)",
            strokeColor: "rgba("+color+",1)",
            pointColor: "rgba("+color+",1)",
            pointHighlightStroke: "rgba("+color+",1)",
            data: data[i]
        })
    }

    new Chart(ctx).Line({labels: labels, datasets: datasets}, lopts);

    canvas.toBuffer(function (err, buf) {
        if (err) throw err;
        fs.writeFile(file, buf);
    });
}

exports.line = line
