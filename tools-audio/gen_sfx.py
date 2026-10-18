"""Own-generated, warm and soft UI / reward sounds (numpy/scipy synthesis, no samples). Licence: CC0.
Run from tools-audio/:  python3 gen_sfx.py   -> writes src/sfx/*.wav ; then python3 normalize.py
Design: sine/marimba/bell tones, low-passed (nothing above ~4-5 kHz), soft attacks, tiny room reverb,
short and low-key so they never compete with the narrator. Pentatonic C major so it can never sound "wrong"."""
import numpy as np, soundfile as sf
from synth import *
C5, D5, E5, G5, A5, C6, E6 = 523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1318.5
OUT = {}

# ui-tap: a soft wooden "tok" (80 ms)
OUT["ui-tap"] = finish(pluck(440, 0.09, 1, 40, -0.12, 0.35, 0.002), 0.8, 0.002, 0.02, 2600)
# card-pop: friendly bubble "bloop", rising, 160 ms - cue that the pictures are ready
t = t_(0.17); f = 330 + 520 * (1 - np.exp(-t * 22))
OUT["card-pop"] = finish(np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t*17) * np.minimum(1, t/0.004), 0.8, 0.003, 0.04, 2400)
# retry-pop: gentle "your turn" nudge, two soft rising marimba notes G4 -> C5
OUT["retry-pop"] = finish(reverb(place([(0, pluck(392, 0.3, 0.9, 9)), (0.12, pluck(C5, 0.4, 1.0, 8))], 0.6), 0.12, 0.3), 0.8, 0.003, 0.08, 3000)
# success-chime: warm bell arpeggio C-E-G with a held top note + tiny room
OUT["success-chime"] = finish(reverb(place([(0, bell(C5, 0.8, .8)), (0.11, bell(E5, 0.8, .85)), (0.22, bell(G5, 1.1, 1.0))], 1.3), 0.2, 0.5), 0.8, 0.004, 0.15, 4200)
# twinkle: ascending pentatonic sparkle, softer than before (lower, low-passed, reverb)
notes = [G5, A5, C6, E6]
OUT["twinkle"] = finish(reverb(place([(i*0.1, bell(fr, 0.6, 0.85 - 0.08*i, 6)) for i, fr in enumerate(notes)], 1.0), 0.28, 0.6), 0.8, 0.004, 0.2, 4800)
# celebrate: 2.2 s happy-but-soft marimba run up the pentatonic + bell sparkle on the top and a warm closing chord
run = [C5, D5, E5, G5, A5, C6, E6]
parts = [(i*0.11, pluck(fr, 0.45, 0.8, 6.5)) for i, fr in enumerate(run)]
parts += [(0.95 + j*0.14, bell(fr, 0.9, 0.35, 5)) for j, fr in enumerate([E6, C6, G5, E6])]
parts += [(1.15, bell(C5, 1.4, 0.7, 3.2)), (1.15, bell(E5, 1.4, 0.6, 3.2)), (1.15, bell(G5, 1.4, 0.55, 3.2))]
OUT["celebrate"] = finish(reverb(place(parts, 2.4), 0.25, 0.7), 0.8, 0.004, 0.35, 4800)
# ui-whoosh: soft airy "swish" (low-passed noise, smooth swell, a gentle upward tilt), no hiss above ~3 kHz
t = t_(0.5); n = RNG.standard_normal(len(t))
sw = lp(n, 900, 4) * (1 - t / 0.5) + lp(n, 2600, 4) * (t / 0.5)   # smooth sweep: dark -> a little brighter
env = np.sin(np.pi * np.clip(t / 0.5, 0, 1)) ** 2
OUT["ui-whoosh"] = finish(lp(sw, 2800, 4) * env, 0.8, 0.02, 0.1)
for k, v in OUT.items():
    sf.write(f"src/sfx/{k}.wav", v, SR); print(k, round(len(v)/SR, 2), "s")
