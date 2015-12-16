"use strict"

if (typeof module !== 'undefined') {
    var fuzzylogic = require("./fuzzylogic")
        fuzzy = exports
} else {
    var fuzzy = {},
        exports = fuzzy
}

// term_delta:
// difference in term number between most current term
// and the term 20 log entries in the past
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
fuzzy.FASTER  = fuzzylogic.Trapezoid(1.00, 1.00, 1.40, 1.80)
fuzzy.SIMILAR = fuzzylogic.Trapezoid(1.40, 1.80, 2.20, 2.60)
fuzzy.SLOWER  = fuzzylogic.Trapezoid(2.20, 2.60, 3.00, 3.00)

fuzzy.infer = function (term_delta, cluster_size) {
    var AND = fuzzylogic.AND, OR = fuzzylogic.OR,
        IF_THEN = fuzzylogic.IF_THEN, 
        f = fuzzy, td = term_delta, cs = cluster_size

    return OR([
        IF_THEN(AND([f.FEW(td),  f.VERYSMALL(cs)]), f.FASTER),
        IF_THEN(AND([f.FEW(td),  f.SMALL(cs)]),     f.FASTER),
        IF_THEN(AND([f.FEW(td),  f.MEDIUM(cs)]),    f.SIMILAR),
        IF_THEN(AND([f.FEW(td),  f.LARGE(cs)]),     f.SIMILAR),
        IF_THEN(AND([f.FEW(td),  f.VERYLARGE(cs)]), f.SLOWER),

        IF_THEN(AND([f.SOME(td), f.VERYSMALL(cs)]), f.FASTER),
        IF_THEN(AND([f.SOME(td), f.SMALL(cs)]),     f.SIMILAR),
        IF_THEN(AND([f.SOME(td), f.MEDIUM(cs)]),    f.SIMILAR),
        IF_THEN(AND([f.SOME(td), f.LARGE(cs)]),     f.SIMILAR),
        IF_THEN(AND([f.SOME(td), f.VERYLARGE(cs)]), f.SLOWER),

        IF_THEN(AND([f.MANY(td), f.VERYSMALL(cs)]), f.SIMILAR),
        IF_THEN(AND([f.MANY(td), f.SMALL(cs)]),     f.SLOWER),
        IF_THEN(AND([f.MANY(td), f.MEDIUM(cs)]),    f.SLOWER),
        IF_THEN(AND([f.MANY(td), f.LARGE(cs)]),     f.SLOWER),
        IF_THEN(AND([f.MANY(td), f.VERYLARGE(cs)]), f.SLOWER)
    ])
}

fuzzy.defuzzify = function(f) {
    return fuzzylogic.Bisector(f, {min: 0.0,
                                   max: 3.0,
                                   delta: 0.01})
}
