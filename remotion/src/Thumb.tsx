import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT } from "./theme";

// 1280x720 YouTube thumbnail. Text is drawn here, never by the image model.
export const Thumb: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg, fontFamily: FONT }}>
    <Img src={staticFile("img/thumb_bg.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <AbsoluteFill style={{ background: "linear-gradient(to right, rgba(11,16,32,0.92) 0%, rgba(11,16,32,0.6) 45%, rgba(11,16,32,0) 75%)" }} />
    <div style={{ position: "absolute", left: 70, top: 55, width: 700 }}>
      <div style={{ color: C.ink, fontSize: 96, fontWeight: 900, lineHeight: 1.0, textShadow: "0 6px 30px rgba(0,0,0,0.7)" }}>
        AI HAS<br />NO VALUES.
      </div>
      <div style={{ color: C.accent, fontSize: 132, fontWeight: 900, lineHeight: 1.05, marginTop: 20, textShadow: "0 6px 30px rgba(0,0,0,0.7)" }}>
        YOU DO.
      </div>
    </div>
    <div style={{ position: "absolute", left: 70, bottom: 50, padding: "12px 28px", borderRadius: 999,
      background: C.accent, color: "#0b1020", fontWeight: 900, fontSize: 40, letterSpacing: 3 }}>
      YOU'RE THE PILOT
    </div>
  </AbsoluteFill>
);
