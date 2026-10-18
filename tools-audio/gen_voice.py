"""Generate the PRIVATE-TEST placeholder voice lines with Kokoro-82M (local, Apache-2.0 weights).
NOT FOR PUBLISHING: the voice is a synthetic stand-in. For release the founder records these
lines himself (see ../docs/RECORDING-SCRIPT.md) or a commercial voice licence is bought.

Voice choice (tools-audio/match_voice.py): of 28 free Kokoro voices, af_jessica at speed 0.80 was the
closest to the existing narrator in pitch (~214 Hz vs ~231 Hz), overall timbre, and speaking pace
(13.4 s vs 13.6 s for the same six sentences). The previous placeholder (af_heart, speed 0.92) was
about 15% faster than the narrator.  Arabic words are given hand-written phonemes so they do not
come out as "Assa-lamoo-aleekum".   Usage: python3 gen_voice.py [voice] [speed]"""
import sys, os, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
K = Kokoro("/workspace/lls/tts/kokoro-v1.0.onnx", "/workspace/lls/tts/voices-v1.0.bin")
voice = sys.argv[1] if len(sys.argv) > 1 else "af_jessica"
speed = float(sys.argv[2]) if len(sys.argv) > 2 else 0.80
def en(t): return K.tokenizer.phonemize(t, "en-us")
LINES = {  # file name: (display text, phonemes)
 "Intro-Assalamu-alaikum-little-hero": ("Assalamu alaikum, little hero! Let's start our day.",
     "ɐsɐlˈɑːmu ɐlˈaɪkʊm, " + en("little hero!") + " " + en("Let's start our day.")),
 "Retry-Try-the-other-picture": ("Try the other picture.", "tɹaɪ ðɪ ˈʌðɚ pˈɪktʃɚ"),  # no stress mark on "Try": otherwise it reads as "Dry"
 "End-MashaAllah-you-did-it-little-hero": ("MashaAllah! You did it, little hero!",
     "mˈɑːʃɑː ˈælɑː! " + en("You did it, little hero!")),
 "Preview-Help": ("Let's help!", en("Let's help!")),
}
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src", "voice"); os.makedirs(out, exist_ok=True)
SPEED = {"Retry-Try-the-other-picture": 0.85}   # the very short line needs a touch more speed to stay crisp
for name, (text, ph) in LINES.items():
    s, sr = K.create(ph, voice=voice, speed=SPEED.get(name, speed), lang="en-us", is_phonemes=True)
    wav = f"/tmp/{name}.wav"; sf.write(wav, s, sr)
    # trim silence both ends, keep a natural ~0.2 s tail; loudness is set later by normalize.py
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", wav, "-af",
      "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
      "apad=pad_dur=0.2",
      "-ar", "44100", "-ac", "1", "-b:a", "128k", f"{out}/{name}.mp3"], check=True)
    print(name, "|", text)
