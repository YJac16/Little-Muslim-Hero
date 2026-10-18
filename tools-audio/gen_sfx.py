"""Own-generated synthesized SFX (pure numpy sine synthesis) - no third-party samples. Licence: CC0."""
import numpy as np, soundfile as sf, subprocess, sys
SR=44100
def env(n,a=0.005,r=0.12):
    e=np.ones(n); na=int(a*SR); nr=int(r*SR)
    e[:na]=np.linspace(0,1,na); e[-nr:]=np.linspace(1,0,nr); return e
def bell(freq,dur,vol=0.5):
    t=np.arange(int(dur*SR))/SR
    s=np.sin(2*np.pi*freq*t)+0.35*np.sin(2*np.pi*freq*2.01*t)+0.12*np.sin(2*np.pi*freq*3.02*t)
    return vol*s*np.exp(-t*7)*env(len(t),0.003,0.05)
def save(name,x):
    x=x/np.max(np.abs(x))*0.7
    sf.write(f"/tmp/{name}.wav",x,SR)
    subprocess.run(["ffmpeg","-y","-v","error","-i",f"/tmp/{name}.wav","-ac","1","-b:a","96k",f"src/{name}.mp3"],check=True)
# card-pop: soft bubble pop, pitch rising sine 0.14s
t=np.arange(int(0.14*SR))/SR
f=380+900*t/0.14
save("card-pop",np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*22)*env(len(t),0.002,0.03))
# twinkle: ascending pentatonic bells
x=np.zeros(int(0.9*SR))
for i,fr in enumerate([784,988,1319,1568]):
    b=bell(fr,0.55,0.8-0.1*i); o=int(i*0.1*SR); x[o:o+len(b)]+=b[:len(x)-o]
save("twinkle",x)
