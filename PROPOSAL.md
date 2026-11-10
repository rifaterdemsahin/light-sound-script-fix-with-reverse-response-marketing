# Proposal: "You're the Pilot": a reverse response to "Technology Is Never Neutral"

Source clip: https://www.youtube.com/shorts/U8bBsJsOnIk (transcript in `video/audio.txt`)

## 1. Source audio

- Source: the YouTube Short above (about 50 s). The transcript was made with Whisper `base`.
- Known transcription errors to fix before quoting: "It's a grease" (unclear), "not made for land" (probably "cooking"). Re-run with `medium` and check by ear.
- Before any new transcription of our own voiceover:
  - Clean the audio: `highpass=f=80,loudnorm`, mono 16 kHz.
  - Force the language to English.
  - Check the level with `volumedetect`, and watch for Whisper hallucinating "Thank you." on silence.
  - Get word timestamps for the animated captions. The word pass can drop the last word, so add `word_patches` if it does.

## 2. Story

**The claim we respond to:** "Technology is never neutral. We designed it for a purpose (a gun is not a kitchen tool), so AI built to extract and surveil is built to control."

**Our reply (reverse response):** Every tool we have ever used was an extension of us. We rode a horse, then drove a car, and now we pilot bots and robots. It is meaningless to argue about the tool's values. The only values in the loop are ours.

**Hook (frame 0, typed out and held about 1 s, 8 words):**
> "A horse had no values. Neither does AI."

It opens a loop: if the tool has none, whose values count? Give it about 3 s before the first spoken word. Trim any filler at the start of the recording (voice_trim) rather than letting the Short grow.

**Script: three acts (about 33 s, about 95 spoken words)**

| Time | Beat | Voiceover |
|------|------|-----------|
| 0:00 to 0:03 | **HOOK** (typed card, no voice) | "A horse had no values. Neither does AI." |
| 0:03 to 0:11 | **ACT 1: Setup** (the old world) | "Someone says technology is never neutral, that AI is built to control. But look at history. We rode a horse. We drove a car. Nobody asked the horse for its values." |
| 0:11 to 0:23 | **ACT 2: Confrontation** (the new tool, the wrong question) | "Now we're pilots of something new: bots, robots, AI. And we keep asking if the machine is good or bad. That's the trap. It has no values to argue about. It goes where the pilot points it. Debate the tool all day and you never touch the one thing that matters." |
| 0:23 to 0:29 | **ACT 3: Resolution** (the payoff) | "So audit the pilot. What do you want it to do? Who does it affect? Would you sign your name under it? You're the pilot. Choose like it." |
| 0:29 to 0:33 | **CTA** (safe, one ask) | "Want to work through those questions with other pilots? Join our Skool community, link in the description." |

END.

**Structure notes:**
- Act 1 sets the world and names the opposing view fairly, in one sentence.
- Act 2 turns it: the question everyone asks is the wrong one.
- Act 3 pays off the hook loop with three concrete pilot questions (the formula), then the one-line close.
- The CTA is one ask with no promise or income claim. The Skool link is a placeholder: **`<SKOOL_URL>`**. Put the real URL in the description and pin it in the comments.

**Length:** keep it under the Short limit. Extend only for the payoff line.

**Proof visuals:** use the author's real screenshots wherever possible (the source clip, our own screen recordings of working with an AI tool). Use AI imagery only as mood.

## 3. Visuals (cheap)

| # | Beat | Visual | Method |
|---|------|--------|--------|
| 1 | Hook | Typed hook card on frame 0 | Remotion hook card |
| 2 | Act 1: "We rode a horse" | Rider on a horse, from behind | fal flux/schnell, 4 steps, Ken Burns |
| 3 | Act 1: "We drove a car" | Windscreen view of a car drive, road ahead | fal flux/schnell, **hero shot 1** (image-to-video) |
| 4 | Act 2: "Pilots of something new" | Pilot with headset overseeing a delivery-route strategy map, friendly bots carrying parcels (command-and-conquer view, delivery of value, not war) | fal flux/schnell, **hero shot 2** (image-to-video) |
| 5 | Act 2: "The trap" | Source clip screenshot, arrow on "never neutral" | Real screenshot, moving-arrow callout |
| 6 | Act 3: pilot questions | Flow: What → Who → Sign your name | Remotion SVG scene (pattern: `JevSketch.tsx`) |
| 7 | Act 3: close | Banner: "Tool: no values. Pilot: yours." | Remotion banner |
| 8 | CTA | Skool community card with `<SKOOL_URL>` | Remotion banner, real Skool screenshot if available |

Image prompts must end with "no text, letters, numbers, UI". Look at every image at full size. If one is bad, delete the file and re-run (outputs are cached). Freeze the last frame if a clip is shorter than its shot.

## 4. Audio

- Voice: highpass, light denoise, loudnorm -14 LUFS, true peak -3.
- Music ducks under speech, using a volume function built from the word times. Fade it out at the end.
- SFX at about 30%. Suggested: a soft whoosh on each scene change, and a click on the typed hook.
- Measure the final mix with `ffmpeg -af ebur128=peak=true`.

## 5. Render (Remotion)

- `storyboard.json` is the single source of truth. `prep_remotion.py` turns it into `remotion/public/data.json`, and the components read it through the typed `src/data.ts`.
- Scenes needed: shot backgrounds + chips, hook card, screenshot callout with moving arrow, banner, SVG flow scene, word-by-word subtitles.
- This Mac's ffmpeg has no libass or freetype, so don't rely on `subtitles` or `drawtext`. The fallback uses Pillow PNGs.
- Preview with `npm run studio`. Check stills at key frames: `npx remotion still src/index.ts Short out.png --frame=N`.

## 6. Secrets and tooling

- `FAL_KEY` comes from Azure Key Vault (`dp-kv-deliverypilot`), injected for one command by `scripts/run.sh`. A 401 means the key is dead, so check both secret versions. Supply a temporary key by env var, never a file.
- Remote installers like `npx skills add ...` may be blocked. This project doesn't need them.
- Already installed locally: `yt-dlp`, `ffmpeg`, `whisper`.

## 7. Sanity check (fill in before publishing)

| Item | Status |
|------|--------|
| **Hook:** curiosity trigger on frame 0, 12 words or fewer, typed and held about 1 s | Drafted, not yet rendered |
| **Delivery:** voiceover recorded, cleaned, transcript checked for hallucinations | Not done |
| **Value:** the reframe (judge the pilot, not the tool) lands within the length limit | Not tested |
| Claims I can't prove | "A tool only points where the pilot points it" is an opinion. It sidesteps the source's argument that design intent shapes a tool. Frame it as our view, not fact. |
| Not verified | Whisper `base` transcript accuracy of the source clip; who the speakers in the source are; that we have rights to reuse the clip's footage or screenshots |
