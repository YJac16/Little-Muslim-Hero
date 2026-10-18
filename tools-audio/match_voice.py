"""Pick the free Kokoro voice (and speed) closest to the game's existing narrator.
Renders the narrator's own English lines with every Kokoro voice and compares
long-term average spectrum (timbre), median pitch and speaking rate.  python3 match_voice.py"""
import subprocess, numpy as np, librosa, soundfile as sf, json, sys, os
from kokoro_onnx import Kokoro
P = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public")
K = Kokoro("/workspace/lls/tts/kokoro-v1.0.onnx", "/workspace/lls/tts/voices-v1.0.bin")
LINES = {
 "Meal-Intro-Before-we-eat-what-do-we-say": "Before we eat, what do we say?",
 "Helping-Intro-Mommy-needs-help-What-can-we-do": "Mommy needs help. What can we do?",
 "Play-Intro-Your-friend-wants-to-play-What-should-we-do": "Your friend wants to play. What should we do?",
 "Success-Helping-is-from-good-character": "Helping is from good character.",
 "Success-Sharing-makes-hearts-happy": "Sharing makes hearts happy.",
 "Success-Sleep-peacefully-little-hero": "Sleep peacefully, little hero.",
}
def load(path):
    return np.frombuffer(subprocess.run(["ffmpeg","-v","error","-i",path,"-f","f32le","-ac","1","-ar","24000","-"],capture_output=True).stdout, np.float32)
def trim(x):
    y,_ = librosa.effects.trim(x, top_db=35); return y
def feat(x, sr=24000):
    x = trim(x)
    S = np.abs(librosa.stft(x, n_fft=1024, hop_length=256))**2
    mel = librosa.feature.melspectrogram(S=S, sr=sr, n_mels=40, fmax=8000)
    e = mel.sum(0); keep = e > e.max()*0.01
    ltas = 10*np.log10(mel[:, keep].mean(1)+1e-12); ltas -= ltas.mean()
    f0,_,_ = librosa.pyin(x, fmin=80, fmax=450, sr=sr, frame_length=1536)
    f0 = f0[~np.isnan(f0)]
    return ltas, (np.median(f0) if len(f0) else 0), len(x)/sr
ref = {k: feat(load(f"{P}/{k}.mp3")) for k in LINES}
rl = np.mean([v[0] for v in ref.values()], 0); rf = np.median([v[1] for v in ref.values()]); rd = sum(v[2] for v in ref.values())
print("narrator: median F0 %.0f Hz, total dur %.2f s" % (rf, rd))
res = []
for v in sorted(K.get_voices()):
    if not (v.startswith("af_") or v.startswith("bf_") or v.startswith("am_") or v.startswith("bm_")): continue
    fs = []
    for k, t in LINES.items():
        s, sr = K.create(t, voice=v, speed=1.0, lang="en-us" if v[0]=="a" else "en-gb"); fs.append(feat(s.astype(np.float32), sr))
    l = np.mean([f[0] for f in fs], 0); f0 = np.median([f[1] for f in fs]); d = sum(f[2] for f in fs)
    dist = float(np.sqrt(np.mean((l - rl)**2)))
    res.append((dist, v, f0, d, rd/d))
    print("%-12s timbre-dist %.2f  F0 %4.0f  dur %.2f  speed-to-match %.2f" % (v, dist, f0, d, rd/d), flush=True)
res.sort(); print("\nBEST:"); [print(r) for r in res[:6]]
json.dump(res, open("/tmp/voice_match.json","w"))
