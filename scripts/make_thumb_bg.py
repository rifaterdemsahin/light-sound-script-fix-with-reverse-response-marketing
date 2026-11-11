import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import fal
root = pathlib.Path(__file__).resolve().parent.parent
out = root / "assets/img/thumb_bg_v.jpg"
if not out.exists():
    r = fal.run("fal-ai/flux/schnell", {
        "prompt": "photorealistic cinematic photo, silhouette of a person seated at the controls of a futuristic cockpit looking out at a glowing sunrise sky with small white drones in the distance, dramatic orange and teal light, dark empty sky area in the upper half for text, person in the lower half, no text, letters, numbers, UI, no watermark",
        "image_size": {"width": 768, "height": 1344}, "num_inference_steps": 4, "num_images": 1})
    fal.download(r["images"][0]["url"], out); print("wrote", out)
