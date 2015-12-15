#!/usr/bin/env node

fuzzy = require("./fuzzy")
graph = require("./graph")

///////////////////

i1 = fuzzy.infer(1, 3)
i2 = fuzzy.infer(6, 3)
i3 = fuzzy.infer(9, 3)
i4 = fuzzy.infer(1, 9)
i5 = fuzzy.infer(6, 9)
i6 = fuzzy.infer(9, 9)
i7 = fuzzy.infer(1, 21)
i8 = fuzzy.infer(6, 21)
i9 = fuzzy.infer(9, 21)



deltas = []
for(var x=0.0; x<20.0; x+=1) { deltas.push(x.toFixed(0)) }
console.log(fuzzy.FEW);
graph.lineChartFile(__dirname + '/deltas.png', deltas,
        [deltas.map(fuzzy.FEW),
         deltas.map(fuzzy.SOME),
         deltas.map(fuzzy.MANY)])

sizes = []
for(var x=1.0; x<41.0; x+=1) { sizes.push(x.toFixed(3)) }
graph.lineChartFile(__dirname + '/sizes.png', sizes,
        [sizes.map(fuzzy.VERYSMALL),
         sizes.map(fuzzy.SMALL),
         sizes.map(fuzzy.MEDIUM),
         sizes.map(fuzzy.LARGE),
         sizes.map(fuzzy.VERYLARGE)])

times = []
for(var x=0.5; x<1.5; x+=0.05) { times.push(x.toFixed(3)) }
graph.lineChartFile(__dirname + '/times.png', times,
        [times.map(i1), times.map(i2), times.map(i3),
         times.map(i4), times.map(i5), times.map(i6),
         times.map(i7), times.map(i8), times.map(i9)])

console.log("i1 Bisect:", fuzzy.defuzzify(i1).toFixed(2));
console.log("i2 Bisect:", fuzzy.defuzzify(i2).toFixed(2));
console.log("i3 Bisect:", fuzzy.defuzzify(i3).toFixed(2));
console.log("i4 Bisect:", fuzzy.defuzzify(i4).toFixed(2));
console.log("i5 Bisect:", fuzzy.defuzzify(i5).toFixed(2));
console.log("i6 Bisect:", fuzzy.defuzzify(i6).toFixed(2));
console.log("i7 Bisect:", fuzzy.defuzzify(i7).toFixed(2));
console.log("i8 Bisect:", fuzzy.defuzzify(i8).toFixed(2));
console.log("i9 Bisect:", fuzzy.defuzzify(i9).toFixed(2));
