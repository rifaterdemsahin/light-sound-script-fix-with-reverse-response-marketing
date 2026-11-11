#!/usr/bin/env python3
"""storyboard.json (+ voiceover word timestamps) -> remotion/public/data.json.

Scene times come from the real voice: each voiced scene starts at its first word.
The hook card owns the first LEAD seconds (voice starts after it).
"""
import json, pathlib, shutil

LEAD = 3.0
root = pathlib.Path(__file__).resolve().parent.parent
sb = json.loads((root / "storyboard.json").read_text())
pub = root / "remotion" / "public"
words_path = root / "assets/audio/words_raw.json"

if words_path.exists():
    raw = json.loads(words_path.read_text())
    ww = [w for s in raw["segments"] for w in s["words"]]
    voiced = [s for s in sb["scenes"] if s.get("voice")]
    counts = [len(s["voice"].split()) for s in voiced]
    assert sum(counts) == len(ww), f"word count mismatch {sum(counts)} vs {len(ww)}"
    i = 0
    for s, n in zip(voiced, counts):
        chunk = ww[i:i + n]; i += n
        s["start"] = round(LEAD + chunk[0]["start"], 3)
        s["words"] = [{"w": t, "t0": round(LEAD + c["start"] - s["start"], 3),
                       "t1": round(LEAD + c["end"] - s["start"], 3)}
                      for t, c in zip(s["voice"].split(), chunk)]
        s["_last_end"] = LEAD + chunk[-1]["end"]
    sb["scenes"][0].update(start=0.0, end=LEAD)
    for a, b in zip(sb["scenes"], sb["scenes"][1:]):
        a["end"] = b["start"]
    last = sb["scenes"][-1]
    last["end"] = round(last.pop("_last_end") + 0.9, 3)
    for s in sb["scenes"]:
        s.pop("_last_end", None)

sb.update(fps=30, width=1080, height=1920,
          total_seconds=max(s["end"] for s in sb["scenes"]))
pub.mkdir(parents=True, exist_ok=True)
for sub in ("img", "video"):
    (pub / sub).mkdir(exist_ok=True)
    for f in (root / "assets" / sub).glob("*"):
        shutil.copy(f, pub / sub / f.name)
(pub / "data.json").write_text(json.dumps(sb, indent=2))
print(f"wrote data.json: {sb['total_seconds']}s, {len(sb['scenes'])} scenes")
for s in sb["scenes"]:
    print(f"  {s['id']} {s['start']:6.2f} -> {s['end']:6.2f}  {s['type']}")
