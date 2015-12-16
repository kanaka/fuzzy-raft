#!/usr/bin/env node

fuzzy = require("./fuzzy")
graph = require("./graph")

///////////////////

deltas = []
for(var x=0.0; x<21.0; x+=1) { deltas.push(x.toFixed(0)) }
console.log(fuzzy.FEW);
graph.lineChartFile(__dirname + '/deltas.png', deltas,
        [deltas.map(fuzzy.FEW),
         deltas.map(fuzzy.SOME),
         deltas.map(fuzzy.MANY)])

sizes = []
for(var x=1.0; x<42.0; x+=1) { sizes.push(x.toFixed(0)) }
graph.lineChartFile(__dirname + '/sizes.png', sizes,
        [sizes.map(fuzzy.VERYSMALL),
         sizes.map(fuzzy.SMALL),
         sizes.map(fuzzy.MEDIUM),
         sizes.map(fuzzy.LARGE),
         sizes.map(fuzzy.VERYLARGE)])

coefficients = []
for(var x=1.0; x<3.1; x+=0.1) { coefficients.push(x.toFixed(1)) }
graph.lineChartFile(__dirname + '/coefficients.png', coefficients,
        [coefficients.map(fuzzy.SLOWER),
         coefficients.map(fuzzy.SIMILAR),
         coefficients.map(fuzzy.FASTER)])

times = []
for(var x=1.0; x<3.1; x+=0.1) { times.push(x.toFixed(2)) }
i1 = fuzzy.infer(1, 3)
i2 = fuzzy.infer(3, 3)
i3 = fuzzy.infer(9, 3)
i4 = fuzzy.infer(1, 9)
i5 = fuzzy.infer(3, 9)
i6 = fuzzy.infer(9, 9)
i7 = fuzzy.infer(1, 13)
i8 = fuzzy.infer(3, 13)
i9 = fuzzy.infer(9, 13)
i10 = fuzzy.infer(1, 21)
i11 = fuzzy.infer(3, 21)
i12 = fuzzy.infer(9, 21)
graph.lineChartFile(__dirname + '/times.png', times,
        [times.map(i1), times.map(i2), times.map(i3),
         times.map(i4), times.map(i5), times.map(i6),
         times.map(i7), times.map(i8), times.map(i9),
         times.map(i10), times.map(i11), times.map(i12)])

graph.lineChartFile(__dirname + '/times_1_3.png', times, [times.map(i1)])
graph.lineChartFile(__dirname + '/times_3_3.png', times, [times.map(i2)])
graph.lineChartFile(__dirname + '/times_3_13.png', times, [times.map(i8)])
graph.lineChartFile(__dirname + '/times_9_21.png', times, [times.map(i12)])

console.log("i1 (1,3)   Bisect:", fuzzy.defuzzify(i1).toFixed(2));
console.log("i2 (3,3)   Bisect:", fuzzy.defuzzify(i2).toFixed(2));
console.log("i3 (9,3)   Bisect:", fuzzy.defuzzify(i3).toFixed(2));
console.log("i4 (1,9)   Bisect:", fuzzy.defuzzify(i4).toFixed(2));
console.log("i5 (3,9)   Bisect:", fuzzy.defuzzify(i5).toFixed(2));
console.log("i6 (9,9)   Bisect:", fuzzy.defuzzify(i6).toFixed(2));
console.log("i7 (1,13)  Bisect:", fuzzy.defuzzify(i7).toFixed(2));
console.log("i8 (3,13)  Bisect:", fuzzy.defuzzify(i8).toFixed(2));
console.log("i9 (9,13)  Bisect:", fuzzy.defuzzify(i9).toFixed(2));
console.log("i10 (1,21) Bisect:", fuzzy.defuzzify(i10).toFixed(2));
console.log("i11 (3,21) Bisect:", fuzzy.defuzzify(i11).toFixed(2));
console.log("i12 (9,21) Bisect:", fuzzy.defuzzify(i12).toFixed(2));
