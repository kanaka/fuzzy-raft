"use strict"

if (typeof module === 'undefined') {
    var fuzzylogic = {},
        exports = fuzzylogic
}

function Trapezoid(a, b, c, d) {
    return function(x) {
        if      (x < a)  { return 0.0 }
        else if (x < b)  { return (x-a) / (b-a) }
        else if (x <= c) { return 1.0 }
        else if (x < d)  { return (d-x) / (d-c) }
        else             { return 0.0 }
    }
}

function _call_or_const(fn, arg) {
    if (typeof fn === 'function') {
        return fn(arg);
    } else {
        return fn;
    }
}

function ReduceWith(f, fn_val_list) {
    return function(x) {
        var acc = _call_or_const(fn_val_list[0], x)
        for (var i=1; i<fn_val_list.length; i++) {
            var acc = f(acc, _call_or_const(fn_val_list[i], x))
        }
        return acc
    }
}

function OR(fn_list) {
    return ReduceWith(Math.max, fn_list)
}

function AND(fn_list) {
    return ReduceWith(Math.min, fn_list)
}

function IF_THEN(input, output) {
    return function(x) {
        var input_val = _call_or_const(input, x);
        var min_fn = function(a, b) {
            return Math.min(input_val, a, b)
        }
        return ReduceWith(min_fn, [1.0, output])(x);
    }
}


function Area(fn, opts) {
    if (typeof opts === 'undefined') { opts = {} }
    if (!('min' in opts)) { opts.min = 0 }
    if (!('max' in opts)) { opts.max = 100 }
    if (!('delta' in opts)) { opts.delta = 0.1 }

    var area = 0
    for (var x=opts.min; x<opts.max; x+=opts.delta) {
        area = area + fn(x)*opts.delta
    }
    return area
}

function Bisector(fn, opts) {
    if (typeof opts === 'undefined') { opts = {} }

    var total_area = Area(fn, opts) // Area sets min, max, delta
    var x = 0,
        left_area = 0
    for (x=opts.min; x<opts.max; x+=opts.delta) {
        left_area = left_area + fn(x)*opts.delta
        if (left_area >= total_area/2) {
            break;
        }
    }
    return x;
}

function CenterOfGravity(fn, opts) {
    if (typeof opts === 'undefined') { opts = {} }

    return x;
}

exports.Trapezoid = Trapezoid
exports.ReduceWith = ReduceWith
exports.AND = AND
exports.OR = OR
exports.IF_THEN = IF_THEN
exports.Area = Area
exports.Bisector = Bisector
