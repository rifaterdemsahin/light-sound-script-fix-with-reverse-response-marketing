import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT } from "./theme";

// 1080x1920 vertical (Short format) thumbnail. Text is drawn here, never by the image model.
export const Thumb: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg, fontFamily: FONT }}>
    <Img src={staticFile("img/thumb_bg_v.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(11,16,32,0.9) 0%, rgba(11,16,32,0.55) 35%, rgba(11,16,32,0) 55%, rgba(11,16,32,0) 75%, rgba(11,16,32,0.7) 100%)" }} />
    <div style={{ position: "absolute", left: 70, right: 70, top: 190, textAlign: "center" }}>
      <div style={{ color: C.ink, fontSize: 130, fontWeight: 900, lineHeight: 1.02, textShadow: "0 6px 30px rgba(0,0,0,0.7)" }}>
        AI HAS<br />NO VALUES.
      </div>
      <div style={{ color: C.accent, fontSize: 210, fontWeight: 900, lineHeight: 1.0, marginTop: 30, textShadow: "0 6px 30px rgba(0,0,0,0.7)" }}>
        YOU DO.
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 230, display: "flex", justifyContent: "center" }}>
      <div style={{ padding: "18px 44px", borderRadius: 999, background: C.accent, color: "#0b1020",
        fontWeight: 900, fontSize: 56, letterSpacing: 4 }}>
        YOU'RE THE PILOT
      </div>
    </div>
  </AbsoluteFill>
);
