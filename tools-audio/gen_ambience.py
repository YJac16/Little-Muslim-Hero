"""Own-generated, very quiet per-moment ambience loops (numpy/scipy synthesis, no samples). Licence: CC0.
Run from tools-audio/:  python3 gen_ambience.py -> src/ambience/*.wav (16 s seamless loops); normalize.py -> public/.
morning: soft bird phrases + airy morning breeze   play: light breeze + a few far wind-chime notes
meal: warm room tone + faint simmer blops        helping: room tone + soft water drips
bedtime: gentle crickets + low warm pad"""
import numpy as np, soundfile as sf
from synth import *
DUR, XF = 16.0, 1.5
rng = np.random.default_rng(2026)
N = int((DUR + XF) * SR)

def noise(): return rng.standard_normal(N)
def swell(period, depth=0.7, phase=0.0):
    t = np.arange(N) / SR
    return (1 - depth) + depth * (0.5 + 0.5 * np.sin(2 * np.pi * t / period + phase))
def add(x, off, sig):
    o = int(off * SR)
    if o < len(x): x[o:o + len(sig)] += sig[: len(x) - o]
def chirp(f0, f1, dur, vol=1.0, wob=0.0):
    t = t_(dur); f = f0 + (f1 - f0) * (t / dur) ** 0.8 + wob * np.sin(2 * np.pi * 38 * t)
    return vol * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.5
def loopify(x):
    n = int(DUR * SR); f = int(XF * SR); y = x[:n].copy(); tail = x[n:n + f]
    r = np.linspace(0, 1, f); y[:f] = y[:f] * r + tail * (1 - r)
    return y.astype(np.float32)
def air(lo, hi, per, depth=0.8):
    return bp(noise(), lo, hi) * swell(per, depth, rng.uniform(0, 6))

def morning():
    x = air(250, 1800, 7.0) * 0.5
    for start in np.arange(0.8, DUR + XF - 1, 2.6):
        s = start + rng.uniform(-0.5, 0.5); base = rng.choice([2600, 3100, 3500]); k = rng.integers(2, 5)
        for i in range(k):
            add(x, s + i * 0.15, chirp(base * rng.uniform(.9, 1.1), base * rng.uniform(1.15, 1.4), 0.09, rng.uniform(.5, .9), 120))
    return reverb(lp(x, 4800), 0.3, 0.8)
def play():
    x = air(200, 1400, 5.5, 0.9) * 0.9
    pent = [1046.5, 1174.7, 1318.5, 1568.0, 1760.0]
    for s in [2.0, 5.3, 8.1, 11.6, 14.2]:
        add(x, s + rng.uniform(-.3, .3), bell(rng.choice(pent), 1.6, 0.05, 3.0))
    return reverb(lp(x, 4000), 0.3, 0.9)
def meal():
    x = lp(noise(), 350, 2) * 0.9 * swell(9.0, 0.3)
    for s in np.arange(0.5, DUR + XF - 1, 0.45):
        if rng.random() < 0.55:
            d = rng.uniform(.04, .08); t = t_(d); f = rng.uniform(250, 450) * (1 + 1.5 * t / d)
            add(x, s + rng.uniform(0, .3), 0.35 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 40))
    return reverb(lp(x, 2200), 0.25, 0.5)
def helping():
    x = lp(noise(), 300, 2) * 0.8 * swell(11.0, 0.3, 1.0)
    for s in np.arange(1.0, DUR + XF - 1, 1.7):
        f0 = rng.uniform(900, 1300); t = t_(0.12); f = f0 * (1 - 0.35 * t / 0.12)
        add(x, s + rng.uniform(0, .8), 0.28 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 28))
    return reverb(lp(x, 2800), 0.3, 0.7)
def bedtime():
    t = np.arange(N) / SR
    pad = (np.sin(2 * np.pi * 110 * t) + 0.6 * np.sin(2 * np.pi * 164.8 * t + 1) + 0.4 * np.sin(2 * np.pi * 220.5 * t + 2)) * (0.8 + 0.2 * np.sin(2 * np.pi * t / 8))
    x = pad * 0.25
    for k, f in enumerate([3500, 3750]):
        gate = np.zeros(N); s = rng.uniform(0.2, 1.0)
        while s < DUR + XF - 1:
            amp = rng.uniform(0.5, 1.0)
            for p in range(rng.integers(2, 5)):
                a = int((s + p * 0.1) * SR); L = int(0.06 * SR)
                if a + L < N: gate[a:a + L] += amp * np.sin(np.pi * np.arange(L) / L) ** 2
            s += rng.uniform(0.9, 1.9)
        x += 0.05 * np.sin(2 * np.pi * f * t) * gate
    return reverb(lp(x, 5200), 0.25, 0.9)

for name, fn in dict(morning=morning, play=play, meal=meal, helping=helping, bedtime=bedtime).items():
    y = loopify(fn()); y = y / (np.max(np.abs(y)) + 1e-9) * 0.5
    sf.write(f"src/ambience/{name}.wav", y, SR); print(name, round(len(y) / SR, 1), "s")
