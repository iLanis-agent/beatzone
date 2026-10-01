var E = require('./engine.js'), n = 0, bad = 0;
function eq(a, b, m, tol) { n++; if (!(Math.abs(a - b) <= (tol == null ? 1e-9 : tol))) { bad++; console.log('FAIL', m, a, b); } }
// AHA "Target Heart Rates Chart": age, 50-85% zone, age-predicted max
[[20, 100, 170, 200], [30, 95, 162, 190], [35, 93, 157, 185], [40, 90, 153, 180], [45, 88, 149, 175], [50, 85, 145, 170], [55, 83, 140, 165], [60, 80, 136, 160], [65, 78, 132, 155], [70, 75, 128, 150]].forEach(function (r) {
  var mx = E.maxHR(r[0], 'fox'); eq(mx, r[3], 'max ' + r[0]); eq(Math.round(E.target(0.5, mx, 60, 'max')), r[1], 'lo ' + r[0]); eq(Math.round(E.target(0.85, mx, 60, 'max')), r[2], 'hi ' + r[0]);
});
// AHA worked example for heart rate reserve: age 50 -> peak 170, resting 72 -> reserve 98, 50% target = 49 + 72 = 121
eq(E.maxHR(50, 'fox'), 170, 'peak'); eq(E.reserve(170, 72), 98, 'reserve'); eq(E.target(0.5, 170, 72, 'reserve'), 121, 'Karvonen 50%'); eq(E.target(0.85, 170, 72, 'reserve'), 72 + 0.85 * 98, 'Karvonen 85%', 1e-9); eq(E.target(0.7, 170, 72, 'reserve'), 140.6, 'Karvonen 70%', 1e-9);
// Tanaka 2001: 208 - 0.7 x age. Same as 220 - age at 40, higher for older, lower for younger
eq(E.maxHR(40, 'tanaka'), 180, 'tanaka 40'); eq(E.maxHR(20, 'tanaka'), 194, 'tanaka 20'); eq(E.maxHR(60, 'tanaka'), 166, 'tanaka 60'); eq(E.maxHR(70, 'tanaka'), 159, 'tanaka 70', 1e-9);
eq(E.maxHR(40, 'tanaka') === E.maxHR(40, 'fox') ? 1 : 0, 1, 'cross at 40'); eq(E.maxHR(65, 'tanaka') > E.maxHR(65, 'fox') ? 1 : 0, 1, 'older higher'); eq(E.maxHR(25, 'tanaka') < E.maxHR(25, 'fox') ? 1 : 0, 1, 'younger lower');
// zones at max 170 (percent of max): moderate 85-119, vigorous 119-145
var z = E.zones(170, 60, 'max'); eq(z.length, 4, 'four zones'); eq(z[1].lo, 85, 'mod lo'); eq(z[1].hi, 119, 'mod hi'); eq(z[2].lo, 119, 'vig lo'); eq(z[2].hi, 145, 'vig hi'); eq(z[3].hi, 170, 'top'); eq(z[0].lo, 0, 'bottom');
for (var i = 1; i < z.length; i++) eq(z[i].lo, z[i - 1].hi, 'contiguous ' + i);
// zones by reserve (age 50, resting 72): moderate 121-141, vigorous 141-155
z = E.zones(170, 72, 'reserve'); eq(z[1].lo, 121, 'r mod lo'); eq(z[1].hi, 141, 'r mod hi'); eq(z[2].hi, 155, 'r vig hi'); eq(z[3].hi, 170, 'r top');
// Karvonen at resting 50: 50 + 0.5 x 120 = 110 versus 85 by percent of max
eq(E.target(0.5, 170, 50, 'reserve') > E.target(0.5, 170, 50, 'max') ? 1 : 0, 1, 'reserve method gives a higher 50% target when resting HR is 50'); 
// classification
[[70, 'rest'], [84, 'rest'], [85, 'moderate'], [118, 'moderate'], [119, 'vigorous'], [144, 'vigorous'], [145.01, 'max'], [160, 'max'], [170, 'max'], [190, 'max']].forEach(function (r) { eq(E.classify(r[0], 170, 60, 'max') === r[1] ? 1 : 0, 1, 'classify ' + r[0]); });
eq(E.classify(120, 170, 72, 'reserve') === 'rest' ? 1 : 0, 1, 'reserve 120 below'); eq(E.classify(121, 170, 72, 'reserve') === 'moderate' ? 1 : 0, 1, 'reserve 121'); eq(E.classify(150, 170, 72, 'reserve') === 'vigorous' ? 1 : 0, 1, 'reserve 150');
// percent helpers
eq(E.pct(85, 170, 60, 'max'), 0.5, 'pct max'); eq(E.pct(121, 170, 72, 'reserve'), 0.5, 'pct reserve'); eq(E.pct(72, 170, 72, 'reserve'), 0, 'pct rest = 0');
console.log(n + ' assertions, ' + bad + ' failed'); process.exit(bad ? 1 : 0);
