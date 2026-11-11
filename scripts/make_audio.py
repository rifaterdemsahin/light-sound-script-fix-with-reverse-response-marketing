import sys, json, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import fal
root = pathlib.Path(__file__).resolve().parent.parent
A = root / "assets/audio"
sb = json.loads((root / "storyboard.json").read_text())
voice = " ".join(s["voice"] for s in sb["scenes"] if s.get("voice"))
(A).mkdir(parents=True, exist_ok=True)
(A / "voice.txt").write_text(voice)

def get(model, args, out, key=("audio", "url")):
    if (A / out).exists():
        return
    r = fal.run(model, args)
    print(model, json.dumps({k: (v if k != "audio" else "…") for k, v in r.items()})[:200])
    url = r["audio"]["url"] if "audio" in r else r["audio_file"]["url"]
    fal.download(url, A / out); print("wrote", out)

what = sys.argv[1:] or ["voice", "music", "sfx"]
if "voice" in what:
    get("fal-ai/kokoro/american-english", {"prompt": voice, "voice": "am_michael", "speed": 1.0}, "voice_raw.wav")
if "music" in what:
    get("cassetteai/music-generator", {"prompt": "calm cinematic ambient underscore, soft pads, gentle pulse, hopeful and thoughtful, no vocals, no drums drop", "duration": 36}, "music.wav")
if "sfx" in what:
    get("cassetteai/sound-effects-generator", {"prompt": "soft cinematic whoosh transition, short", "duration": 2}, "whoosh.wav")
    get("cassetteai/sound-effects-generator", {"prompt": "single soft keyboard typing click, clean", "duration": 1}, "click.wav")
