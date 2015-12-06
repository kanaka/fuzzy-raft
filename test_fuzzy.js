#!/usr/bin/env node

fuzzy = require("./fuzzy")
graph = require("./graph")

///////////////////

i1 = fuzzy.infer(1, 10)
i2 = fuzzy.infer(6, 10)
i3 = fuzzy.infer(9, 10)
i4 = fuzzy.infer(1, 90)
i5 = fuzzy.infer(6, 90)
i6 = fuzzy.infer(9, 90)
i7 = fuzzy.infer(1, 130)
i8 = fuzzy.infer(6, 130)
i9 = fuzzy.infer(9, 130)



deltas = []
for(var x=0.0; x<20.0; x+=1) { deltas.push(x.toFixed(0)) }
console.log(fuzzy.FEW);
graph.line(__dirname + '/deltas.png', deltas,
        [deltas.map(fuzzy.FEW),
         deltas.map(fuzzy.SOME),
         deltas.map(fuzzy.MANY)])

speeds = []
for(var x=0.0; x<1.0; x+=0.05) { speeds.push(x.toFixed(3)) }
graph.line(__dirname + '/speeds.png', speeds,
        [speeds.map(fuzzy.SLOWER),
         speeds.map(fuzzy.SIMILAR),
         speeds.map(fuzzy.FASTER)])

timers = []
for(var x=0.0; x<1.0; x+=0.05) { timers.push(x.toFixed(3)) }
graph.line(__dirname + '/timer.png', timers,
        [timers.map(i1), timers.map(i2), timers.map(i3),
         timers.map(i4), timers.map(i5), timers.map(i6),
         timers.map(i7), timers.map(i8), timers.map(i9)])

console.log("i1 Bisect:", fuzzy.defuzzify(i1).toFixed(2));
console.log("i2 Bisect:", fuzzy.defuzzify(i2).toFixed(2));
console.log("i3 Bisect:", fuzzy.defuzzify(i3).toFixed(2));
console.log("i4 Bisect:", fuzzy.defuzzify(i4).toFixed(2));
console.log("i5 Bisect:", fuzzy.defuzzify(i5).toFixed(2));
console.log("i6 Bisect:", fuzzy.defuzzify(i6).toFixed(2));
console.log("i7 Bisect:", fuzzy.defuzzify(i7).toFixed(2));
console.log("i8 Bisect:", fuzzy.defuzzify(i8).toFixed(2));
console.log("i9 Bisect:", fuzzy.defuzzify(i9).toFixed(2));
