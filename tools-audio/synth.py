"""Tiny shared synthesis helpers (numpy/scipy only, no samples). Everything made with this is own-generated, CC0."""
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
SR = 44100
RNG = np.random.default_rng(16)

def t_(dur): return np.arange(int(dur * SR)) / SR
def lp(x, fc, order=2): return sosfilt(butter(order, fc, "lowpass", fs=SR, output="sos"), x)
def hp(x, fc, order=2): return sosfilt(butter(order, fc, "highpass", fs=SR, output="sos"), x)
def bp(x, lo, hi, order=2): return sosfilt(butter(order, [lo, hi], "bandpass", fs=SR, output="sos"), x)

def pluck(freq, dur, vol=1.0, decay=7.0, glide=0.0, bright=0.25, attack=0.006):
    """Soft marimba/kalimba-like note: sine + a quickly dying 2nd and an inharmonic 4th partial."""
    t = t_(dur)
    f = freq * (1 + glide * t / dur)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) + bright * np.sin(2 * ph) * np.exp(-t * 16) + 0.06 * np.sin(3.99 * ph) * np.exp(-t * 40)
    env = np.exp(-t * decay) * np.minimum(1, t / attack) * np.minimum(1, (dur - t) / 0.05)
    return vol * s * env

def bell(freq, dur, vol=1.0, decay=4.5):
    """Warm glass bell: sine + soft partials at 2.0 / 2.76 / 5.4 (struck-bar ratios), slow-ish decay."""
    t = t_(dur)
    s = (np.sin(2*np.pi*freq*t) + 0.30*np.sin(2*np.pi*freq*2.0*t)*np.exp(-t*3)
         + 0.12*np.sin(2*np.pi*freq*2.76*t)*np.exp(-t*7) + 0.04*np.sin(2*np.pi*freq*5.4*t)*np.exp(-t*14))
    return vol * s * np.exp(-t * decay) * np.minimum(1, t / 0.012) * np.minimum(1, (dur - t) / 0.08)

def place(parts, total):
    x = np.zeros(int(total * SR))
    for off, n in parts:
        o = int(off * SR)
        if o < len(x): x[o:o + len(n)] += n[: len(x) - o]
    return x

def reverb(x, wet=0.18, rt=0.5, tail=None):
    """Small room: exponentially decaying noise impulse response, low-passed so it stays soft."""
    n = int(rt * SR)
    ir = RNG.standard_normal(n) * np.exp(-np.arange(n) / SR * (6.9 / rt))
    ir = lp(ir, 3500); ir[0] = 0; ir /= np.sqrt(np.sum(ir ** 2))
    y = fftconvolve(x, ir)[: len(x) + (int(tail * SR) if tail else 0)]
    x = np.pad(x, (0, len(y) - len(x)))
    return x * (1 - wet) + y * wet * 1.5

def finish(x, peak=0.8, fade_in=0.004, fade_out=0.04, fc=None):
    if fc: x = lp(x, fc)
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    a, r = int(fade_in * SR), int(fade_out * SR)
    x[:a] *= np.linspace(0, 1, a); x[-r:] *= np.linspace(1, 0, r)
    return x.astype(np.float32)
