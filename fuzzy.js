#!/usr/bin/env node

"use strict"

if (typeof module === 'undefined') {
    var fuzzy = {},
        exports = fuzzy
}

var fl = require("./fuzzylogic")

// term_delta:
// difference in term number between most current term and the term 20
// log entries in the past
var FEW  = exports.FEW  = fl.Trapezoid(0,0,2,4)
var SOME = exports.SOME = fl.Trapezoid(3,5,7,9)
var MANY = exports.MANY = fl.Trapezoid(8,10,20,20)

// last_candidate: number of seconds since we were last a candidate
var RECENT = exports.RECENT = fl.Trapezoid(0,0,10,20)
var OLDER  = exports.OLDER  = fl.Trapezoid(10,20,60,120)
var OLD    = exports.OLD    = fl.Trapezoid(60,120,Infinity,Infinity)

var FASTER  = exports.FASTER  = fl.Trapezoid(0.00, 0.00, 0.40, 0.80)
var SIMILAR = exports.SIMILAR = fl.Trapezoid(0.40, 0.80, 1.20, 1.60)
var SLOWER  = exports.SLOWER  = fl.Trapezoid(1.20, 1.60, 2.00, 2.00)

// if (term_delta is MANY) THEN (timer is SLOWER)
// if (term_delta is SOME) THEN (timer is SIMILAR)
// if (term_delta is FEW)  THEN (timer is FASTER)
// if (last_candidate is RECENT) THEN (timer is SLOWER)
// if (last_candidate is OLDER)  THEN (timer is SIMILAR)
// if (last_candidate is OLD)    THEN (timer is FASTER)
exports.infer = function (term_delta, last_candidate) {
    var r1 = fl.IF_THEN(MANY(term_delta),       SLOWER),
        r2 = fl.IF_THEN(SOME(term_delta),       SIMILAR),
        r3 = fl.IF_THEN(FEW(term_delta),        FASTER),
        r4 = fl.IF_THEN(RECENT(last_candidate), SLOWER),
        r5 = fl.IF_THEN(OLDER(last_candidate),  SIMILAR)
        r5 = fl.IF_THEN(OLD(last_candidate),    FASTER)
    return fl.OR([r1, r2, r3, r4, r5]) 
}

exports.defuzzify = function(f) {
    return fl.Bisector(f)
}
