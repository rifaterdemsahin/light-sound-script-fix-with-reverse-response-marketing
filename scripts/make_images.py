import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import fal
root = pathlib.Path(__file__).resolve().parent.parent
NEG = "no text, no letters, no words, no labels, no numbers, no UI, no watermark"
SHOTS = {
 "command": "photorealistic cinematic photo, over the shoulder of a calm person in a dark command center looking at a huge glowing holographic strategy map, real-time-strategy command and conquer style top-down view of a city, glowing delivery routes connecting warehouses to homes, small friendly robot units carrying parcels along the routes, teal and amber light, peaceful productive atmosphere, person wearing a pilot headset seen from behind, map shows only glowing lines and icons with no labels, no weapons, no military, " + NEG,
 "horse": "photorealistic cinematic photo, lone rider on a horse seen from behind walking across an open golden-hour field, long shadows, warm backlight, shallow depth of field, 35mm film, " + NEG,
 "car": "photorealistic cinematic photo, view through a car windscreen of an empty highway at dusk heading toward the horizon, hands on steering wheel in soft focus, warm orange sky, " + NEG,
 "cockpit": "photorealistic cinematic photo, view from inside a modern cockpit looking out at a sky filled with friendly sleek white delivery robots and small drones, soft blue morning light, depth, " + NEG,
}
for name, prompt in SHOTS.items():
    out = root / "assets/img" / f"{name}.jpg"
    if out.exists():
        continue  # cached; delete to regenerate
    r = fal.run("fal-ai/flux/schnell", {"prompt": prompt, "image_size": {"width": 768, "height": 1344},
                                         "num_inference_steps": 4, "num_images": 1, "enable_safety_checker": True})
    fal.download(r["images"][0]["url"], out); print("wrote", out)
