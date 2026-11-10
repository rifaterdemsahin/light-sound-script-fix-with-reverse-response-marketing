import React from "react";
import {
  AbsoluteFill,
  Audio,
  Freeze,
  Img,
  OffthreadVideo,
  Sequence,
  staticFile,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { data, Scene } from "./data";
import { ACT_LABEL, C, FONT } from "./theme";

const Chip: React.FC<{ act: string }> = ({ act }) => {
  const label = ACT_LABEL[act];
  if (!label) return null;
  return (
    <div style={{
      position: "absolute", top: 90, left: 60, padding: "16px 30px",
      borderRadius: 999, background: "rgba(11,16,32,0.75)",
      border: `3px solid ${C.accent}`, color: C.accent, fontFamily: FONT,
      fontWeight: 800, fontSize: 36, letterSpacing: 4,
    }}>{label}</div>
  );
};

// Word-by-word subtitles driven by real word timestamps from the voiceover.
const Subtitles: React.FC<{ words: NonNullable<Scene["words"]> }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let idx = words.findIndex((w) => t < w.t1);
  if (idx < 0) idx = words.length - 1;
  const group = 3;
  const start = Math.floor(idx / group) * group;
  const shown = words.slice(start, start + group);
  return (
    <div style={{
      position: "absolute", left: 60, width: 960, bottom: 260, display: "flex",
      flexWrap: "wrap", justifyContent: "center", columnGap: 20, boxSizing: "border-box",
      fontFamily: FONT, fontWeight: 900, fontSize: 76, lineHeight: 1.15,
      textShadow: "0 6px 24px rgba(0,0,0,0.9)",
    }}>
      {shown.map((w, i) => (
        <span key={i} style={{ color: start + i === idx ? C.accent : C.ink }}>{w.w}</span>
      ))}
    </div>
  );
};

const Hook: React.FC<{ s: Scene }> = ({ s }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const text = s.text ?? "";
  const typed = Math.min(text.length, Math.floor((frame / (fps * 1.4)) * text.length));
  const caret = Math.floor(frame / 8) % 2 === 0 || typed < text.length;
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(circle at 50% 40%, ${C.bg2}, ${C.bg})`,
      justifyContent: "center", padding: 80, fontFamily: FONT,
    }}>
      <div style={{ color: C.accent, fontSize: 40, fontWeight: 800, letterSpacing: 6, marginBottom: 40 }}>
        THE QUESTION
      </div>
      <div style={{ color: C.ink, fontSize: 130, fontWeight: 900, lineHeight: 1.1 }}>
        {text.slice(0, typed)}
        <span style={{ color: C.accent, opacity: caret ? 1 : 0 }}>|</span>
      </div>
    </AbsoluteFill>
  );
};

const Shot: React.FC<{ s: Scene }> = ({ s }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = (s.end - s.start) * fps;
  const zoom = interpolate(frame, [0, dur], [1, 1.08]);
  const hero = s.art === "car" || s.art === "command";
  const media = hero ? (
    <Freeze frame={Math.min(frame, 148)}>
      <OffthreadVideo src={staticFile(`video/${s.art}.mp4`)} muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Freeze>
  ) : (
    <Img src={staticFile(`img/${s.art}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>{media}</AbsoluteFill>
      <AbsoluteFill style={{
        background: "linear-gradient(to bottom, rgba(11,16,32,0.25) 0%, rgba(11,16,32,0) 25%, rgba(11,16,32,0) 55%, rgba(11,16,32,0.8))",
      }} />
    </AbsoluteFill>
  );
};

// Stand-in for the real screenshot: quote card + moving arrow. Swap for the
// author's screenshot once we have one and the rights to reuse it.
const Callout: React.FC<{ s: Scene }> = ({ s }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = (s.quote ?? "").split("|");
  const pop = spring({ frame: frame - 10, fps, config: { damping: 12 } });
  const nudge = Math.sin(frame / 5) * 18;
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(circle at 50% 35%, ${C.bg2}, ${C.bg})`,
      justifyContent: "center", alignItems: "center", fontFamily: FONT,
    }}>
      <div style={{
        width: 900, padding: "70px 60px", borderRadius: 40, background: "#f5f3ee",
        color: "#14182e", transform: `scale(${0.85 + 0.15 * pop})`, opacity: pop,
        boxShadow: "0 40px 100px rgba(0,0,0,0.6)", marginTop: -200,
      }}>
        <div style={{ fontSize: 34, fontWeight: 700, color: "#6a7099", letterSpacing: 3, marginBottom: 30 }}>
          THE SOURCE CLIP SAYS
        </div>
        {lines.map((l, i) => {
          const hl = l === s.callout;
          return (
            <div key={i} style={{
              fontSize: hl ? 130 : 66, fontWeight: 900, lineHeight: 1.2,
              color: hl ? C.danger : "#14182e", position: "relative", display: "inline-block",
            }}>
              {l}
              {hl && (
                <div style={{
                  position: "absolute", left: 0, right: 0, bottom: 6, height: 12, background: C.danger,
                  transformOrigin: "left", transform: `scaleX(${interpolate(frame, [30, 55], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })})`,
                }} />
              )}
              <br />
            </div>
          );
        })}
        <div style={{
          position: "absolute", right: -30 + nudge, top: 250, fontSize: 130, color: C.accent,
          transform: "rotate(180deg)", opacity: pop,
        }}>➜</div>
      </div>
    </AbsoluteFill>
  );
};

const Flow: React.FC<{ s: Scene }> = ({ s }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const steps = s.steps ?? [];
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(circle at 50% 30%, ${C.bg2}, ${C.bg})`,
      alignItems: "center", fontFamily: FONT,
    }}>
      <div style={{ marginTop: 260, color: C.accent2, fontSize: 70, fontWeight: 900, letterSpacing: 4 }}>
        AUDIT THE PILOT
      </div>
      <svg width="1080" height="1100" viewBox="0 0 1080 1100" style={{ marginTop: 40 }}>
        {steps.map((t, i) => {
          const p = spring({ frame: frame - i * 22, fps, config: { damping: 14 } });
          const y = 40 + i * 340;
          return (
            <g key={i} opacity={p} transform={`translate(0 ${(1 - p) * 40})`}>
              {i > 0 && <line x1="540" y1={y - 100} x2="540" y2={y} stroke={C.accent} strokeWidth="8" strokeDasharray="14 12" />}
              <rect x="90" y={y} width="900" height="240" rx="40" fill="#161d40" stroke={C.accent2} strokeWidth="6" />
              <circle cx="190" cy={y + 120} r="52" fill={C.accent} />
              <text x="190" y={y + 140} textAnchor="middle" fontSize="64" fontWeight="900" fill="#0b1020">{i + 1}</text>
              <foreignObject x="270" y={y} width="680" height="240">
                <div style={{
                  height: 240, display: "flex", alignItems: "center", color: C.ink,
                  fontFamily: FONT, fontWeight: 800, fontSize: 58, lineHeight: 1.1,
                }}>{t}</div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const Banner: React.FC<{ s: Scene }> = ({ s }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 13 } });
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(circle at 50% 40%, ${C.bg2}, ${C.bg})`,
      justifyContent: "center", alignItems: "center", textAlign: "center",
      padding: 70, fontFamily: FONT,
    }}>
      <div style={{ transform: `scale(${0.8 + 0.2 * p})`, opacity: p }}>
        {s.image ? (
          <div style={{ background: "#fff", borderRadius: 48, padding: "30px 40px", margin: "0 auto 60px", width: 760,
            boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
            <Img src={staticFile(`img/${s.image}`)} style={{ width: "100%", display: "block" }} />
          </div>
        ) : (
          <div style={{ width: 160, height: 14, background: C.accent, margin: "0 auto 60px", borderRadius: 8 }} />
        )}
        <div style={{ color: C.ink, fontSize: s.image ? 96 : 124, fontWeight: 900, lineHeight: 1.1 }}>{s.text}</div>
        {s.sub && <div style={{ color: C.accent, fontSize: 56, fontWeight: 800, marginTop: 50 }}>{s.sub}</div>}
      </div>
    </AbsoluteFill>
  );
};

const SceneView: React.FC<{ s: Scene; durationFrames: number }> = ({ s, durationFrames }) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 6, durationFrames - 6, durationFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const body =
    s.type === "hook_card" ? <Hook s={s} /> :
    s.type === "shot" ? <Shot s={s} /> :
    s.type === "screenshot_callout" ? <Callout s={s} /> :
    s.type === "svg_flow" ? <Flow s={s} /> :
    <Banner s={s} />;
  return (
    <AbsoluteFill style={{ opacity: s.type === "hook_card" ? 1 : fade }}>
      {body}
      <Chip act={s.act} />
      {s.words && s.type !== "svg_flow" && s.type !== "banner" && <Subtitles words={s.words} />}
    </AbsoluteFill>
  );
};

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const pct = Math.min(1, frame / (durationInFrames - 1));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 16, background: "rgba(245,243,238,0.2)" }}>
      <div style={{ width: `${pct * 100}%`, height: "100%", background: C.accent }} />
    </div>
  );
};

export const Short: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Audio src={staticFile("mix.wav")} />
      {data.scenes.map((s) => {
        const from = Math.round(s.start * fps);
        const dur = Math.round((s.end - s.start) * fps);
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur}>
            <SceneView s={s} durationFrames={dur} />
          </Sequence>
        );
      })}
      <ProgressBar />
    </AbsoluteFill>
  );
};
