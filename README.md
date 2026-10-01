# BeatZone

Heart rate zones from age and resting heart rate.

- Max heart rate: 220 - age (classic, used by the AHA chart) or Tanaka 2001: 208 - 0.7 x age
- Zones (AHA): moderate about 50-70% of max, vigorous about 70-85%
- Reserve method (Karvonen): rest + fraction x (max - rest). AHA example: age 50, resting 72 -> 50% target 121 bpm
- Enter a live heart rate to see its zone

Tests match every row of the AHA target heart rate chart (ages 20-70) and the AHA worked example. Estimates only; not medical advice.

Static client-side. `node test-engine.js` runs the tests.
Sources: https://www.heart.org/en/healthy-living/exercise-and-physical-activity/fitness-basics/target-heart-rates , https://www2.heart.org/site/DocServer/STEAM_-_Finding_Your_Target_Heart_Rate.pdf , https://doi.org/10.1016/s0735-1097(00)01054-8
