(function (root) {
  'use strict';
  // Age-predicted maximum heart rate (bpm)
  function maxHR(age, formula) { return formula === 'tanaka' ? 208 - 0.7 * age : 220 - age; }
  // AHA: moderate intensity about 50-70% of maximum, vigorous about 70-85%
  var ZONES = [
    { key: 'rest', name: 'Below target', lo: 0, hi: 0.5 },
    { key: 'moderate', name: 'Moderate', lo: 0.5, hi: 0.7 },
    { key: 'vigorous', name: 'Vigorous', lo: 0.7, hi: 0.85 },
    { key: 'max', name: 'Above target', lo: 0.85, hi: 1.0 }
  ];
  // Heart rate at a fraction of max (percent-of-max method) or of heart rate reserve (Karvonen: rest + frac x (max - rest))
  function target(frac, max, rest, method) { return method === 'reserve' ? rest + frac * (max - rest) : frac * max; }
  function reserve(max, rest) { return max - rest; }
  function zones(max, rest, method) {
    return ZONES.map(function (z) { return { key: z.key, name: z.name, lo: Math.round(target(z.lo, max, rest, method)), hi: Math.round(target(z.hi, max, rest, method)), loPct: z.lo, hiPct: z.hi }; });
  }
  // Which zone a live heart rate falls in. Boundaries belong to the higher zone, except max which is the top zone.
  function classify(hr, max, rest, method) {
    var z = zones(max, rest, method), exact = ZONES.map(function (x) { return [target(x.lo, max, rest, method), target(x.hi, max, rest, method)]; });
    for (var i = 0; i < ZONES.length; i++) if (hr < exact[i][1] || i === ZONES.length - 1) return z[i].key;
  }
  // Percent of max / of reserve for a given heart rate
  function pct(hr, max, rest, method) { return method === 'reserve' ? (hr - rest) / (max - rest) : hr / max; }
  var api = { ZONES: ZONES, maxHR: maxHR, target: target, reserve: reserve, zones: zones, classify: classify, pct: pct };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Beat = api;
})(typeof window !== 'undefined' ? window : this);
