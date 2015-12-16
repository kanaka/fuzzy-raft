"use strict"

if (typeof module !== 'undefined') {
    var fuzzylogic = require("./fuzzylogic")
        fuzzy = exports
} else {
    var fuzzy = {},
        exports = fuzzy
}

// term_delta:
// difference in term number between most current term and the term 20
// log entries in the past
fuzzy.FEW  = fuzzylogic.Trapezoid(0,0,1,3)
fuzzy.SOME = fuzzylogic.Trapezoid(1,3,7,9)
fuzzy.MANY = fuzzylogic.Trapezoid(7,9,20,20)

// cluster_size:
// the number of nodes in the cluster
fuzzy.VERYSMALL = fuzzylogic.Trapezoid(0,0,3,7)
fuzzy.SMALL     = fuzzylogic.Trapezoid(1,4,6,9)
fuzzy.MEDIUM    = fuzzylogic.Trapezoid(5,9,17,23)
fuzzy.LARGE     = fuzzylogic.Trapezoid(17,23,29,38)
fuzzy.VERYLARGE = fuzzylogic.Trapezoid(29,38,Infinity,Infinity)

// result:
// multiplier on the base election timer
fuzzy.FASTER  = fuzzylogic.Trapezoid(0.50, 0.50, 0.70, 0.90)
fuzzy.SIMILAR = fuzzylogic.Trapezoid(0.70, 0.90, 1.10, 1.30)
fuzzy.SLOWER  = fuzzylogic.Trapezoid(1.10, 1.30, 1.50, 1.50)

fuzzy.infer = function (term_delta, cluster_size) {
    var fl = fuzzylogic, f = fuzzy,
        td = term_delta, cs = cluster_size

    return fl.OR([
        fl.IF_THEN(fl.AND([f.FEW(td),  f.VERYSMALL(cs)]), f.FASTER),
        fl.IF_THEN(fl.AND([f.FEW(td),  f.SMALL(cs)]),     f.FASTER),
        fl.IF_THEN(fl.AND([f.FEW(td),  f.MEDIUM(cs)]),    f.SIMILAR),
        fl.IF_THEN(fl.AND([f.FEW(td),  f.LARGE(cs)]),     f.SIMILAR),
        fl.IF_THEN(fl.AND([f.FEW(td),  f.VERYLARGE(cs)]), f.SLOWER),

        fl.IF_THEN(fl.AND([f.SOME(td), f.VERYSMALL(cs)]), f.FASTER),
        fl.IF_THEN(fl.AND([f.SOME(td), f.SMALL(cs)]),     f.SIMILAR),
        fl.IF_THEN(fl.AND([f.SOME(td), f.MEDIUM(cs)]),    f.SIMILAR),
        fl.IF_THEN(fl.AND([f.SOME(td), f.LARGE(cs)]),     f.SIMILAR),
        fl.IF_THEN(fl.AND([f.SOME(td), f.VERYLARGE(cs)]), f.SLOWER),

        fl.IF_THEN(fl.AND([f.MANY(td), f.VERYSMALL(cs)]), f.SIMILAR),
        fl.IF_THEN(fl.AND([f.MANY(td), f.SMALL(cs)]),     f.SLOWER),
        fl.IF_THEN(fl.AND([f.MANY(td), f.MEDIUM(cs)]),    f.SLOWER),
        fl.IF_THEN(fl.AND([f.MANY(td), f.LARGE(cs)]),     f.SLOWER),
        fl.IF_THEN(fl.AND([f.MANY(td), f.VERYLARGE(cs)]), f.SLOWER)
    ])
}

fuzzy.defuzzify = function(f) {
    return fuzzylogic.Bisector(f, {min: 0.0,
                                   max: 2.0,
                                   delta: 0.01})
}
