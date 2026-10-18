"""Own-generated gentle wrong-answer cues (pure numpy synthesis, no samples). Licence: CC0.
Soft kalimba/marimba-like notes, major intervals falling gently ("oh-oh", "boop", "sigh"):
kind and short (<1 s), never a buzzer. Run from tools-audio/:  python3 gen_wrong_cues.py
Writes src/wrong-*.wav; normalize.sh then loudness-matches them into public/."""
import numpy as np, soundfile as sf
SR = 44100

def note(freq, dur, vol=1.0, glide=0.0, decay=6.5):
    t = np.arange(int(dur * SR)) / SR
    f = freq * (1 + glide * t / dur)                       # slight downward droop = "aww"
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) + 0.28 * np.sin(2 * ph) * np.exp(-t * 14) + 0.10 * np.sin(4.1 * ph) * np.exp(-t * 30)
    env = np.exp(-t * decay) * np.minimum(1, t / 0.014) * np.minimum(1, (dur - t) / 0.06)
    return vol * s * env

def seq(parts, total):
    x = np.zeros(int(total * SR))
    for off, n in parts:
        o = int(off * SR); x[o:o + len(n)] += n[: len(x) - o]
    return x

def lowpass(x, fc=3200):
    a = np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); p = 0.0
    for i, v in enumerate(x): p = (1 - a) * v + a * p; y[i] = p
    return y

CUES = {
  # "oh-oh": two falling notes G5 -> E5
  "wrong-oh": seq([(0.00, note(784, 0.45, 1.0, -0.01)), (0.20, note(659, 0.50, 0.9, -0.02))], 0.72),
  # "boop": one warm round note with a soft little drop, plus a quiet answering note
  "wrong-boop": seq([(0.00, note(523, 0.42, 1.0, -0.06, 7)), (0.22, note(440, 0.40, 0.55, -0.03, 8))], 0.66),
  # "sigh": three softly falling notes D5 B4 G4
  "wrong-sigh": seq([(0.00, note(587, 0.40, 0.9)), (0.17, note(494, 0.40, 0.85)), (0.34, note(392, 0.5, 0.8, -0.02))], 0.88),
}
for name, x in CUES.items():
    x = lowpass(x); x = x / np.max(np.abs(x)) * 0.8
    sf.write(f"src/{name}.wav", x.astype(np.float32), SR)
    print(name, round(len(x) / SR, 2), "s")
