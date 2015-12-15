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
fuzzy.SOME = fuzzylogic.Trapezoid(2,4,6,8)
fuzzy.MANY = fuzzylogic.Trapezoid(7,9,20,20)

// cluster_size: the number of nodes in the cluster
fuzzy.VERYSMALL = fuzzylogic.Trapezoid(0,0,3,7)
fuzzy.SMALL     = fuzzylogic.Trapezoid(1,3,5,9)
fuzzy.MEDIUM    = fuzzylogic.Trapezoid(5,9,17,23)
fuzzy.LARGE     = fuzzylogic.Trapezoid(17,23,29,38)
fuzzy.VERYLARGE = fuzzylogic.Trapezoid(29,38,Infinity,Infinity)

// result:
// multiplier on the base election timer
fuzzy.FASTER  = fuzzylogic.Trapezoid(0.50, 0.50, 0.70, 0.90)
fuzzy.SIMILAR = fuzzylogic.Trapezoid(0.70, 0.90, 1.10, 1.30)
fuzzy.SLOWER  = fuzzylogic.Trapezoid(1.10, 1.30, 1.50, 1.50)

// if (term_delta is FEW)  THEN (timer is FASTER)
// if (term_delta is SOME) THEN (timer is SIMILAR)
// if (term_delta is MANY) THEN (timer is SLOWER)
// if (cluster_size is VERYSMALL) THEN (timer is FASTER)
// if (cluster_size is SMALL)     THEN (timer is SIMILAR)
// if (cluster_size is MEDIUM)    THEN (timer is SIMILAR)
// if (cluster_size is LARGE)     THEN (timer is SLOWER)
// if (cluster_size is VERYLARGE) THEN (timer is SLOWER)
fuzzy.infer = function (term_delta, cluster_size) {
    var r1 = fuzzylogic.IF_THEN(fuzzy.FEW(term_delta),
                                fuzzy.FASTER),
        r2 = fuzzylogic.IF_THEN(fuzzy.SOME(term_delta),
                                fuzzy.SIMILAR),
        r3 = fuzzylogic.IF_THEN(fuzzy.MANY(term_delta),
                                fuzzy.SLOWER),

        r4 = fuzzylogic.IF_THEN(fuzzy.VERYSMALL(cluster_size),
                                fuzzy.FASTER),
        r5 = fuzzylogic.IF_THEN(fuzzy.SMALL(cluster_size),
                                fuzzy.SIMILAR),
        r6 = fuzzylogic.IF_THEN(fuzzy.MEDIUM(cluster_size),
                                fuzzy.SIMILAR),
        r7 = fuzzylogic.IF_THEN(fuzzy.LARGE(cluster_size),
                                fuzzy.SLOWER),
        r8 = fuzzylogic.IF_THEN(fuzzy.VERYLARGE(cluster_size),
                                fuzzy.SLOWER)

    return fuzzylogic.OR([r1, r2, r3, r4, r5, r6, r7, r8])
}

fuzzy.defuzzify = function(f) {
    return fuzzylogic.Bisector(f)
}
