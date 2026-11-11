import sys, base64, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import fal
root = pathlib.Path(__file__).resolve().parent.parent
MODEL = sys.argv[1] if len(sys.argv) > 1 else "fal-ai/ltx-video/image-to-video"
HERO = {
 "command": "small robot units glide along the glowing delivery routes carrying parcels between warehouses and homes on the holographic map, the person watches calmly, subtle camera push in, cinematic",
 "car": "the car drives forward smoothly down the highway, road markings flowing toward the camera, gentle camera motion, cinematic",
 "cockpit": "white delivery drones and robots drift slowly through the clouds outside the window, subtle camera movement, cinematic",
}
for name, motion in HERO.items():
    out = root / "assets/video" / f"{name}.mp4"
    if out.exists():
        continue
    b64 = base64.b64encode((root / f"assets/img/{name}.jpg").read_bytes()).decode()
    r = fal.run(MODEL, {"prompt": motion, "image_url": f"data:image/jpeg;base64,{b64}",
                      "aspect_ratio": "9:16", "resolution": "480p"})
    print({k: (v if k != "video" else v.get("url")) for k, v in r.items()})
    fal.download(r["video"]["url"], out); print("wrote", out)
