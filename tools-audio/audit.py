"""Audio audit: duration, loudness, peaks, clipping, noise floor, lead/trail silence, pitch, brightness.
Run from tools-audio/:  python3 audit.py [out.md] [--glob DIR ...]   (default: every clip the game can play)
Needs ffmpeg, numpy, scipy, librosa. Prints a markdown table, writes it to out.md if given."""
import sys, os, re, json, subprocess, glob, numpy as np
P = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public")
def decode(path):
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", "44100", "-"], capture_output=True)
    return np.frombuffer(r.stdout, np.float32), 44100
def lufs(path):
    r = subprocess.run(["ffmpeg", "-nostats", "-i", path, "-af", "loudnorm=print_format=json", "-f", "null", "-"], capture_output=True, text=True)
    j = json.loads(re.search(r"\{[^{}]*\}", r.stderr[r.stderr.rfind("{"):]).group(0))
    return float(j["input_i"]), float(j["input_tp"])
def db(x): return 20 * np.log10(max(x, 1e-9))
def analyse(path, voice=False):
    x, sr = decode(path); dur = len(x) / sr
    pk = db(np.max(np.abs(x))); clip = int(np.sum(np.abs(x) >= 0.995))
    w = int(0.05 * sr); n = len(x) // w
    rms = np.sqrt(np.mean(x[: n * w].reshape(n, w) ** 2, axis=1)) if n else np.array([1e-9])
    rd = 20 * np.log10(np.maximum(rms, 1e-9))
    floor = float(np.percentile(rd, 10)) if n >= 5 else float(rd.min())
    act = np.where(rd > rd.max() - 40)[0]
    end = db(float(np.sqrt(np.mean(x[-int(0.005 * sr):] ** 2)))) if len(x) > 300 else -120.0
    lead = act[0] * 0.05 if len(act) else 0; trail = dur - (act[-1] + 1) * 0.05 if len(act) else 0
    spec = np.abs(np.fft.rfft(x * np.hanning(len(x)))); fr = np.fft.rfftfreq(len(x), 1 / sr)
    cen = float((spec * fr).sum() / max(spec.sum(), 1e-9))
    f0 = None
    if voice and dur > 0.4:
        import librosa
        f, vf, _ = librosa.pyin(x, fmin=80, fmax=500, sr=sr, frame_length=2048)
        f = f[~np.isnan(f)]
        f0 = float(np.median(f)) if len(f) > 5 else None
    l, tp = lufs(path) if dur >= 0.4 else (float("nan"), float("nan"))
    return dict(dur=dur, lufs=l, tp=tp, peak=pk, clip=clip, floor=floor, lead=lead, trail=trail, centroid=cen, f0=f0, end=end,
                kb=os.path.getsize(path) / 1024)
def flags(a, kind):
    f = []
    if a["clip"] > 0: f.append("CLIP")
    if a["peak"] > -1.0: f.append("hot peak")
    if kind == "voice":
        if not (-22 <= a["lufs"] <= -18): f.append("loudness off")
    if a["end"] > -50 and kind not in ("amb", "bed"): f.append("abrupt end")
    if a["lead"] > 0.25: f.append("long lead")
    if a["trail"] > 0.4: f.append("long tail")
    return ",".join(f) or "ok"
if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.endswith(".md")]
    out = next((a for a in sys.argv[1:] if a.endswith(".md")), None)
    sets = args or ["final", "wrong", "nasheed"]
    files = []
    if "orig" in sets:
        files += [(f, "voice" if re.search(r"Intro|Preview|Success", f) else "sfx") for f in sorted(glob.glob(P + "/*.mp3"))]
    for d in [a for a in sets if os.path.isdir(a)]:   # any directory of mp3s, e.g. an old copy of final/
        files += [(f, "voice" if re.search(r"Intro|Preview|Success|Retry|End-", os.path.basename(f)) else "sfx") for f in sorted(glob.glob(d + "/*.mp3"))]
    if "final" in sets:
        files += [(f, "voice" if re.search(r"Intro|Preview|Success|Retry|End-", os.path.basename(f)) else "sfx") for f in sorted(glob.glob(P + "/assets/audio/final/*.mp3"))]
    if "voice" in sets:
        files += [(f, "voice") for f in sorted(glob.glob(P + "/assets/audio/voice/*.mp3"))]
    if "sfx" in sets:
        files += [(f, "sfx") for f in sorted(glob.glob(P + "/assets/audio/sfx/*.mp3"))]
    if "wrong" in sets:
        files += [(f, "cue") for f in sorted(glob.glob(P + "/assets/audio/wrong/*.mp3"))]
    if "ambience" in sets:
        files += [(f, "amb") for f in sorted(glob.glob(P + "/assets/audio/ambience/*.mp3"))]
    if "nasheed" in sets:
        files += [(P + "/assets/audio/nasheed-bg.mp3", "bed")]
    rows = ["| file | dur s | LUFS | peak dBFS | clip | end dBFS | lead/tail s | F0 Hz | centroid Hz | flags |", "|---|---|---|---|---|---|---|---|---|---|"]
    for f, kind in files:
        a = analyse(f, voice=(kind == "voice"))
        rows.append("| %s | %.2f | %.1f | %.1f | %d | %.0f | %.2f/%.2f | %s | %d | %s |" % (
            os.path.relpath(f, P) if not f.startswith("/tmp") else "(before) " + os.path.basename(f), a["dur"], a["lufs"], a["peak"], a["clip"], a["end"], a["lead"], a["trail"],
            "%.0f" % a["f0"] if a["f0"] else "-", a["centroid"], flags(a, kind)))
    t = "\n".join(rows); print(t)
    if out: open(out, "w").write(t + "\n")
