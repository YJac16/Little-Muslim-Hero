"""Generate PRIVATE-TEST placeholder voice lines with Kokoro-82M (local, Apache-2.0).
Replace with the game's original narrator voice before publishing."""
import sys, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
K = Kokoro("/workspace/lls/tts/kokoro-v1.0.onnx", "/workspace/lls/tts/voices-v1.0.bin")
LINES = {
 "Intro-Assalamu-alaikum-little-hero": "Assalamu alaikum, little hero! Let's start our day.",
 "Retry-Try-the-other-picture": "Try the other picture.",
 "End-MashaAllah-you-did-it-little-hero": "MashaAllah! You did it, little hero!",
 "Preview-Help": "Let's help!",
}
voice = sys.argv[1] if len(sys.argv) > 1 else "af_heart"
speed = float(sys.argv[2]) if len(sys.argv) > 2 else 0.92
out = sys.argv[3] if len(sys.argv) > 3 else "/tmp/voices"
import os; os.makedirs(out, exist_ok=True)
for name, text in LINES.items():
    s, sr = K.create(text, voice=voice, speed=speed, lang="en-us")
    wav = f"{out}/{name}.wav"; sf.write(wav, s, sr)
    mp3 = f"{out}/{name}.mp3"
    # trim silence, loudness-match to existing narration (~ -22 dB mean), mono 44.1k 128k
    subprocess.run(["ffmpeg","-y","-v","error","-i",wav,"-af",
      "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm=I=-20:TP=-3:LRA=7,apad=pad_dur=0.05",
      "-ar","44100","-ac","1","-b:a","128k",mp3],check=True)
    print(name, text)
