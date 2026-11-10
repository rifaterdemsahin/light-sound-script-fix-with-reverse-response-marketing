# 🎬 Master Spec: Reverse-Response Short (reusable)

A repeatable recipe for turning a source clip or idea into a finished YouTube Short: script, realistic visuals, voice, music, SFX, thumbnail, metadata and a cost report. Built and proven on "You're the Pilot" (this repo). Copy this file to a new project, fill in section 0, and follow the stages in order.

> 🔒 Secrets rule: the fal key lives in an env var for one command at a time. Never write it to a file, a commit or a chat log. If a key was pasted into a chat, rotate it.

---

## 0. 📝 Brief (fill in per video)

| Field | Value |
|---|---|
| Working title | |
| Source clip URL (optional) | |
| The claim we answer | one sentence |
| Our reply (the reverse response) | one sentence |
| Hook (≤ 12 words, true open loop) | |
| Payoff (formula / result) | |
| CTA target (community / link) | name + `<URL>` placeholder |
| Target length | ≤ 40 s (hard limit 60 s) |
| Format | 9:16, 1080×1920, 30 fps |
| Voice | model + voice id |
| Visual style | photoreal / cinematic, no on-image text |

---

## 1. 🧭 Pipeline at a glance

```
source clip ─► transcript (Whisper) ─► script (hook + 3 acts + CTA)
                                              │
                       storyboard.json  ◄─────┘   (single source of truth)
                         │
   ┌──────────┬──────────┼───────────┬────────────┐
 images    animation   voice      music + SFX   thumbnail bg
 (fal)     (fal, 2)    (fal)        (fal)        (fal)
   └──────────┴──────────┼───────────┴────────────┘
                         ▼
        Whisper word timestamps ─► prep_remotion.py ─► data.json
                         ▼
             mix_audio.py (duck, SFX, -14 LUFS)
                         ▼
                 Remotion render ─► short.mp4 + thumbnail.png
                         ▼
        metadata.html · costs.html · SANITY_CHECK.md · commit & push
```

---

## 2. 🗂️ Repo layout

```
README.md              source link
MASTER_SPEC.md         this file
PROPOSAL.md            the idea + script + storyboard table
storyboard.json        single source of truth (scenes, voice lines, prompts)
SANITY_CHECK.md        hook / delivery / value, unproven claims, not-verified list
index.html             project page (video, script beats, status, links)
script.html            printable script
metadata.html          YouTube title, description, tags, upload settings, thumbnail
costs.html             spend breakdown
thumbnail.png          1280×720
skool.png (etc.)       brand assets used in the CTA
assets/{img,video,audio}   generated outputs (cached; delete a file to regenerate)
scripts/               fal.py, make_*.py, prep_remotion.py, mix_audio.py
remotion/              src/{Short,Thumb,Root,data,theme}.tsx, public/ (generated)
```

---

## 3. 📖 Script structure

Hook, then three acts, then CTA. About 95 to 110 spoken words for a 35 to 40 s Short.

| Beat | Time | Job |
|---|---|---|
| 🪝 Hook | 0:00–0:03 | Typed card on frame 0. A true curiosity trigger plus the question the Short answers. No voice. Hold about 1 s after typing. |
| 🎭 Act 1: Setup | to ~0:10 | Name the opposing view fairly in one sentence. Establish the old world. |
| ⚔️ Act 2: Confrontation | to ~0:23 | The turn: the question everyone asks is the wrong one. Name the trap. |
| ✅ Act 3: Resolution | to ~0:30 | Pay off the hook with a formula (e.g. 3 questions) and a one-line close. |
| 📣 CTA | last 5 s | One ask, no promises or income claims. Name the community. |

Rules: close the open loop; end opinions as opinions; don't invent facts; mark anything unprovable in `SANITY_CHECK.md`.

---

## 4. 🧾 `storyboard.json` schema

```jsonc
{
  "title": "…", "language": "en", "max_seconds": 40, "cta_url": "<URL>",
  "scenes": [
    { "id": 1, "act": "hook", "type": "hook_card", "text": "…", "voice": null },
    { "id": 2, "act": "1", "type": "shot", "art": "horse",
      "image_prompt": "… no text, letters, numbers, UI",
      "motion": "ken_burns | image_to_video", "voice": "…" },
    { "id": 5, "act": "2", "type": "screenshot_callout", "quote": "line|HIGHLIGHT|line", "callout": "HIGHLIGHT", "voice": "…" },
    { "id": 6, "act": "3", "type": "svg_flow", "steps": ["…","…","…"], "voice": "…" },
    { "id": 8, "act": "cta", "type": "banner", "text": "Join <Community>", "sub": "…", "image": "brand.png", "voice": "…" }
  ]
}
```

Times are **not** hand-written. `prep_remotion.py` sets each voiced scene's start from its first word's timestamp (hook owns the first 3 s), then writes `remotion/public/data.json` including per-word timings for subtitles.

---

## 5. 🤖 fal.ai models and prices (checked 2026-11-10)

Price check: `GET https://api.fal.ai/v1/models/pricing?endpoint_id=<id>` with header `Authorization: Key $FAL_KEY`.

| Job | Endpoint | Unit price | Notes |
|---|---|---|---|
| Images | `fal-ai/flux/schnell` | $0.003 / MP | 4 steps, 768×1344 for 9:16, 1280×720 for thumbnails. Always add "no text, letters, numbers, UI". |
| Animation | `fal-ai/ltx-video-13b-distilled/image-to-video` | $0.04 / unit | Pass `aspect_ratio: "9:16"`, `resolution: "480p"`. ⚠️ `fal-ai/ltx-video/image-to-video` ignores portrait and returns a stretched 768×512 clip. |
| Voice | `fal-ai/kokoro/american-english` | $0.02 / 1000 chars | Voice `am_michael`. Clean after: highpass 80, atempo 1.12, loudnorm. |
| Music | `cassetteai/music-generator` | $0.02 / min | One 36 s bed, loops and ducks. |
| SFX | `cassetteai/sound-effects-generator` | $0.01 / generation | Whoosh (2 s), click (1 s). |

Client: `scripts/fal.py` (queue API: POST `https://queue.fal.run/<model>`, poll `status_url`, GET `response_url`). Auth header `Authorization: Key <id>:<secret>`.

Run every generation as `FAL_KEY='…' python3 -I scripts/<script>.py`. Outputs are cached by filename. Delete a file to regenerate it.

---

## 6. 🎙️ Audio spec

1. Generate voice, then `ffmpeg -af "highpass=f=80,atempo=1.12,loudnorm=I=-14:TP=-3:LRA=7" -ac 1 -ar 24000`.
2. Check it by ear and by transcript. Whisper hallucinates "Thank you." on silence. Force `--language en`.
3. Word timestamps: resample to 16 kHz mono, `whisper --model base --word_timestamps True`. **Word count must equal the script's word count**, or `prep_remotion.py` stops. The word pass can drop the last word (use patches).
4. Mix (`scripts/mix_audio.py`): voice delayed by the 3 s hook, music at 0.55 with `sidechaincompress` ducking, fade in 1.5 s and out 3 s, whoosh at each scene change (30%), clicks on the hook, `loudnorm` then `volume=1.8dB`.
5. Verify: `ffmpeg -i mix.wav -af ebur128=peak=true -f null -`. Target **-14 LUFS, true peak ≤ -3 dBFS**.

---

## 7. 🎨 Visual spec

- Realistic shots: 3 images, animate **at most 2** hero shots. Others use a slow zoom (Ken Burns). Freeze the last frame if a clip is shorter than its scene.
- Diagrams and anything with meaning: draw in Remotion SVG, never ask an image model for text.
- Brand logos and the author's real screenshots: use as given, on a white card for contrast.
- Always look at every generated image at full size. Regenerate any with garbled text, bad hands or wrong aspect.
- Chips for each act (top left), word-by-word subtitles (3 words at a time, 76 px, bottom third), progress bar (16 px, bottom edge).
- Palette and fonts live in `remotion/src/theme.ts`.
- This Mac's ffmpeg has no libass or freetype, so use Remotion for all text. Do not use `subtitles` or `drawtext`.

---

## 8. 🖼️ Thumbnail spec

- 1280×720 Remotion still (`Thumb` composition). Photoreal background from flux/schnell with a dark empty side for text.
- Text: the claim in 2 lines (white) plus the answer (accent, largest). One small tag line. Max 6 to 8 words.
- Render: `npx remotion still src/index.ts Thumb out/thumbnail.png`, copy to repo root.
- Check: nothing overlaps, readable at 160 px wide, no real person's face.

---

## 9. 📺 YouTube metadata spec (`metadata.html`)

- **Title** ≤ 100 chars, claim plus answer, `#Shorts` at the end. Keep 2 alternates.
- **Description:** hook line, 2 to 3 sentence reframe, the formula as a list, CTA with community name and `<URL>`, honesty line (opinion, AI-generated media), 3 to 5 hashtags.
- **Tags** ≤ 500 chars total.
- **Upload settings:** Not made for kids. **Altered or synthetic content = Yes** when voice or visuals are realistic AI. Pinned comment with the CTA.
- Copy buttons and character counters on the page.

---

## 10. 💰 Cost spec (`costs.html`)

Report: total spent including mistakes, cost to rebuild cleanly, line items (endpoint, unit price, what ran, cost, note), what is free (Whisper, ffmpeg, Remotion), and where the money went. Say clearly these are estimates from the pricing API, not an invoice, and link the fal dashboard.

Reference (this project): about $0.19 spent, about $0.14 clean rebuild. Biggest line is animation.

Cost rules: animate ≤ 2 shots; test a new model on 1 image first; lock the script and CTA before generating the voice; reuse the music bed; keep a shared SFX folder.

---

## 11. 🧪 Sanity check (before publishing)

Fill in `SANITY_CHECK.md`:

- [ ] **Hook:** curiosity trigger on frame 0, ≤ 12 words, typed and held about 1 s, about 3 s before the first spoken word
- [ ] **Delivery:** voice listened to by a human; transcript matches script
- [ ] **Value:** reframe lands; payoff delivered; one CTA
- [ ] **Length:** measured, under the limit
- [ ] **Loudness:** -14 LUFS, TP ≤ -3
- [ ] **Unproven claims:** listed and framed as opinion
- [ ] **Not verified:** listed (reuse rights of source footage, speaker identity, etc.)
- [ ] `<URL>` placeholders replaced
- [ ] No secrets in the repo (`grep -rI "fal_sk_"`)

---

## 12. 🧠 Lessons learned (don't repeat)

| Problem | Fix |
|---|---|
| Cheap i2v model returned a stretched 768×512 clip | Use the 13b distilled model with `aspect_ratio: "9:16"`. Check size before the second clip. |
| Voice ran 40 s, plan was 33 s | Set `atempo`, or retime scenes to the real word timestamps. Never hand-time scenes. |
| CTA changed after the voice was made | Lock the script first. Each voice redo costs about $0.014 and a re-timing. |
| Subtitle line overflowed the frame | Use flex-wrap in a fixed 960 px box and show 3 words. |
| `sed -i` failed on macOS | Use `sed -i ''` or edit with a script/tool. |
| Key pasted into chat | Use it as an env var only; rotate it afterwards. |
| Generated images invent text | "no text, letters, numbers, UI" and inspect every image. |
| Two bars at the bottom on Shorts | The platform draws its own progress line; keep ours thin or lift it. |

---

## 13. ▶️ Quick start for a new video

```bash
# 1. copy the repo, edit README.md (source link), PROPOSAL.md, storyboard.json
# 2. transcript of the source (optional)
yt-dlp -x --audio-format mp3 -o "video/audio.%(ext)s" "<url>" && whisper video/audio.mp3 --model base --output_dir video
# 3. generate assets (one command at a time, key as env var)
FAL_KEY='…' python3 -I scripts/make_images.py
FAL_KEY='…' python3 -I scripts/make_video.py fal-ai/ltx-video-13b-distilled/image-to-video
FAL_KEY='…' python3 -I scripts/make_audio.py
# 4. clean voice, word timestamps -> assets/audio/words_raw.json (see section 6)
# 5. build
python3 scripts/prep_remotion.py && python3 scripts/mix_audio.py
cd remotion && npm install && npm run render   # out/short.mp4
npx remotion still src/index.ts Thumb out/thumbnail.png
# 6. update metadata.html, costs.html, SANITY_CHECK.md; open index.html; commit and push
```

Preview any time with `npm run studio` and check stills: `npx remotion still src/index.ts Short out/f.png --frame=N`.

---

## 14. 🔗 Output conventions (assistant behaviour)

When working on this project: show every file or page as a **clickable URL** (`file:///…` for local files, `https://github.com/…` after a push), and use emojis to make summaries scannable. Open local pages in Google Chrome with `open -a "Google Chrome" <url>`.
