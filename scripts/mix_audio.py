#!/usr/bin/env python3
"""voice + ducked music + SFX (~30%) -> remotion/public/mix.wav, then measure loudness."""
import json, pathlib, subprocess
root = pathlib.Path(__file__).resolve().parent.parent
A = root / "assets/audio"
d = json.loads((root / "remotion/public/data.json").read_text())
T = d["total_seconds"]
starts = [s["start"] for s in d["scenes"][2:]]          # whoosh on each scene change after the first shot
clicks = [0.15, 0.45, 0.75]                              # hook typing

ins = ["-i", A / "voice.wav", "-i", A / "music.wav", "-i", A / "whoosh.wav", "-i", A / "click.wav"]
f = ["[0:a]adelay=3000|3000,apad,atrim=0:%.2f[v]" % T,
     "[v]asplit=2[v1][v2]",
     "[1:a]aloop=loop=-1:size=2e9,atrim=0:%.2f,volume=0.55[m0]" % T,
     "[m0][v2]sidechaincompress=threshold=0.02:ratio=8:attack=20:release=400[md]",
     "[md]afade=t=in:d=1.5,afade=t=out:st=%.2f:d=3[m]" % (T - 3)]
mix = ["[v1]", "[m]"]
for i, t in enumerate(starts):
    f.append("[2:a]volume=0.3,adelay=%d|%d[w%d]" % (int(t*1000-150), int(t*1000-150), i)); mix.append(f"[w{i}]")
for i, t in enumerate(clicks):
    f.append("[3:a]volume=0.3,adelay=%d|%d[c%d]" % (int(t*1000), int(t*1000), i)); mix.append(f"[c{i}]")
f.append("".join(mix) + "amix=inputs=%d:normalize=0:duration=longest,atrim=0:%.2f,loudnorm=I=-14:TP=-3:LRA=9,volume=1.8dB[out]" % (len(mix), T))
out = root / "remotion/public/mix.wav"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *map(str, ins), "-filter_complex", ";".join(f),
                "-map", "[out]", "-ar", "44100", "-ac", "2", str(out)], check=True)
r = subprocess.run(["ffmpeg", "-i", str(out), "-af", "ebur128=peak=true", "-f", "null", "-"],
                   capture_output=True, text=True).stderr
print(r[r.rfind("Summary"):])
