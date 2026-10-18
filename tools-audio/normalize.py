"""Loudness-match every clip the game plays (run from tools-audio/:  python3 normalize.py).
Originals are NOT modified: sources stay where they are, matched copies are written to
public/assets/audio/final/ (and wrong/ for the wrong-answer cue set).
Measure with ffmpeg loudnorm (EBU R128 integrated LUFS), apply a plain gain, then a -2 dBFS
true-peak-safe limiter. Blips (<0.4 s, too short for LUFS) are peak-matched instead."""
import json, subprocess, re, os, sys
P = "../public"
VOICE, CUE, SFX, BLIP, AMB = -20.0, -21.0, -26.0, "peak-14", -30.0
JOBS = []
def add(src, dst, target, trim=False, fade=False): JOBS.append((src, dst, target, trim, fade))
for n in ["Morning-Intro-Good-morning-little-hero-When-we-wake-up-what-do-we-say", "Play-Intro-Your-friend-wants-to-play-What-should-we-do",
          "Meal-Intro-Before-we-eat-what-do-we-say", "Helping-Intro-Mommy-needs-help-What-can-we-do", "Bedtime-Intro-Before-we-sleep-we-make-our-dua",
          "Preview-Alhamdulilah", "Preview-Bismillah", "Preview-Share", "Success-MashaAllah-Allah-loves-when-we-remember-Him",
          "Success-Sharing-makes-hearts-happy", "Success-Bismillah-brings-barakah", "Success-Helping-is-from-good-character", "Success-Sleep-peacefully-little-hero"]:
    add(f"{P}/{n}.mp3", f"{P}/assets/audio/final/{n}.mp3", VOICE, fade=True)
for n in ["Intro-Assalamu-alaikum-little-hero", "Retry-Try-the-other-picture", "End-MashaAllah-you-did-it-little-hero", "Preview-Help"]:
    add(f"src/voice/{n}.mp3", f"{P}/assets/audio/final/{n}.mp3", VOICE, fade=True)
# sound effects: own-synthesized by gen_sfx.py (round 6). The original sfx/*.mp3 stay in the repo, unused, as the "before".
for n in ["success-chime", "celebrate", "ui-whoosh", "twinkle"]: add(f"src/sfx/{n}.wav", f"{P}/assets/audio/final/{n}.mp3", SFX, fade=True)
for n in ["ui-tap", "retry-pop", "card-pop"]: add(f"src/sfx/{n}.wav", f"{P}/assets/audio/final/{n}.mp3", BLIP, fade=True)
# per-moment ambience loops from gen_ambience.py: very quiet, -30 LUFS in the file, played at ~0.35 volume and ducked under voices
for n in ["morning", "play", "meal", "helping", "bedtime"]: add(f"src/ambience/{n}.wav", f"{P}/assets/audio/ambience/{n}.mp3", AMB)
# wrong-answer cue set (one folder = the swappable set)
add(f"{P}/Preview-Mine.mp3", f"{P}/assets/audio/wrong/wrong-mine.mp3", CUE, trim=True, fade=True)
for n in ["oh", "boop", "sigh"]: add(f"src/wrong-{n}.wav", f"{P}/assets/audio/wrong/wrong-{n}.mp3", CUE, trim=True, fade=True)

def run(*a): return subprocess.run(a, capture_output=True, text=True)
def measure(path, af=""):
    r = run("ffmpeg", "-nostats", "-i", path, "-af", (af + "," if af else "") + "loudnorm=print_format=json", "-f", "null", "-")
    j = json.loads(re.search(r"\{[^{}]*\}", r.stderr[r.stderr.rfind("{"):]).group(0))
    pk = run("ffmpeg", "-nostats", "-i", path, "-af", (af + "," if af else "") + "volumedetect", "-f", "null", "-").stderr
    return float(j["input_i"]), float(re.search(r"max_volume: (-?[\d.]+)", pk).group(1))
report = []
for src, dst, target, trim, fade in JOBS:
    pre = []
    if trim: pre.append("silenceremove=start_periods=1:start_threshold=-50dB")
    pre = ",".join(pre)
    dur = float(run("ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src).stdout)
    lufs, peak = measure(src, pre)
    if isinstance(target, str):
        gain = float(target.split("peak")[1]) - peak
    else:
        gain = target - lufs
    chain = ([pre] if pre else []) + (["areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse"] if trim else []) + [f"volume={gain:.2f}dB", "alimiter=limit=0.794:attack=2:release=40:level=disabled"]
    if fade: chain += ["afade=t=in:d=0.005", "areverse,afade=t=in:d=0.03,areverse"]
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    r = run("ffmpeg", "-y", "-v", "error", "-i", src, "-af", ",".join(chain), "-ac", "1", "-ar", "44100", "-b:a", "128k", "-map_metadata", "-1", dst)
    assert r.returncode == 0, r.stderr
    lufs2, peak2 = measure(dst)
    d2 = float(run("ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", dst).stdout)
    report.append((os.path.relpath(dst, P), round(dur, 2), round(d2, 2), round(lufs, 1), round(lufs2, 1), round(peak, 1), round(peak2, 1)))
print(f"{'file':100} {'dur_in':>6} {'dur_out':>7} {'LUFS_in':>8} {'LUFS_out':>8} {'pk_in':>6} {'pk_out':>6}")
for r in report: print(f"{r[0]:100} {r[1]:6} {r[2]:7} {r[3]:8} {r[4]:8} {r[5]:6} {r[6]:6}")
