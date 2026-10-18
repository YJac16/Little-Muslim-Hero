"""Spectrogram contact sheet for eyeballing synthesized audio.  python3 spec.py "src/sfx/*.wav" out.png"""
import glob, sys, numpy as np, soundfile as sf, matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
fs = sorted(glob.glob(sys.argv[1])); n = len(fs); rows = (n + 2) // 3
fig, ax = plt.subplots(rows, 3, figsize=(15, 2.6 * rows)); ax = np.atleast_1d(ax).ravel()
for a, f in zip(ax, fs):
    x, sr = sf.read(f); x = x if x.ndim == 1 else x[:, 0]
    a.specgram(x, NFFT=1024, Fs=sr, noverlap=768, vmin=-130, vmax=-30, cmap="magma"); a.set_ylim(0, 9000); a.set_title(f.split("/")[-1])
for a in ax[n:]: a.axis("off")
plt.tight_layout(); plt.savefig(sys.argv[2], dpi=60)
