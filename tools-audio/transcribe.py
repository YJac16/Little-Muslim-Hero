"""Transcribe clips with faster-whisper (local) to check what is actually spoken.  python3 transcribe.py file...."""
import sys, subprocess, numpy as np
from faster_whisper import WhisperModel
m = WhisperModel("base.en", device="cpu", compute_type="int8")
for f in sys.argv[1:]:
    x = np.frombuffer(subprocess.run(["ffmpeg","-v","error","-i",f,"-f","f32le","-ac","1","-ar","16000","-"],capture_output=True).stdout, np.float32)
    x = np.concatenate([np.zeros(8000, np.float32), x, np.zeros(8000, np.float32)])
    s, _ = m.transcribe(x, language="en", beam_size=3)
    print(f.split("/")[-1][:60], "|", " ".join(t.text.strip() for t in s))
