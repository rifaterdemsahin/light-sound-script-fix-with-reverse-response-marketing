import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "./theme";

// Pure-SVG illustrations (viewBox 1080x1920). No image model, so no garbled text.

const Sky: React.FC<{ id: string; top: string; bottom: string }> = ({ id, top, bottom }) => (
  <defs>
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={top} />
      <stop offset="1" stopColor={bottom} />
    </linearGradient>
  </defs>
);

export const HorseArt: React.FC = () => {
  const f = useCurrentFrame();
  const s = Math.sin(f / 4);
  const leg = (x: number, phase: number) => (
    <g transform={`rotate(${Math.sin(f / 4 + phase) * 22} ${x} 1260)`}>
      <rect x={x - 14} y={1260} width={28} height={190} rx={14} fill="#120d1f" />
    </g>
  );
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      <Sky id="hs" top="#2b1d54" bottom="#ff9a5c" />
      <rect width="1080" height="1920" fill="url(#hs)" />
      <circle cx="780" cy="900" r="170" fill="#ffd28a" opacity="0.9" />
      <path d="M0 1250 Q220 1080 480 1230 T1080 1180 V1920 H0Z" fill="#3a2a5e" />
      <path d="M0 1380 Q300 1280 640 1370 T1080 1340 V1920 H0Z" fill="#241a3d" />
      <g transform={`translate(0 ${s * 6})`}>
        {leg(430, 0)}
        {leg(470, 2.5)}
        {leg(650, 1.2)}
        {leg(690, 3.7)}
        <ellipse cx="560" cy="1200" rx="230" ry="95" fill="#120d1f" />
        <path d="M740 1170 L850 1010 L915 1040 L820 1220Z" fill="#120d1f" />
        <path d="M850 1010 L985 1075 L965 1125 L905 1100 L915 1040Z" fill="#120d1f" />
        <path d="M850 1010 L835 960 L870 990Z" fill="#120d1f" />
        <path d="M340 1170 Q250 1190 230 1330 Q300 1250 350 1230Z" fill="#120d1f" />
        {/* rider */}
        <rect x="520" y="980" width="70" height="170" rx="30" fill="#0a0713" />
        <circle cx="555" cy="945" r="42" fill="#0a0713" />
        <path d="M590 1040 L690 1090" stroke="#0a0713" strokeWidth="22" strokeLinecap="round" />
      </g>
    </svg>
  );
};

export const CarArt: React.FC = () => {
  const f = useCurrentFrame();
  const dashes = Array.from({ length: 9 }, (_, i) => {
    const t = ((i + f * 0.045) % 9) / 9;
    const y = 900 + t * t * 1020;
    const w = 6 + t * t * 70;
    const h = 8 + t * t * 220;
    return <rect key={i} x={540 - w / 2} y={y} width={w} height={h} fill={C.ink} opacity={0.9} />;
  });
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      <Sky id="cs" top="#16224d" bottom="#ff8a5c" />
      <rect width="1080" height="1920" fill="url(#cs)" />
      <circle cx="540" cy="880" r="130" fill="#ffd28a" opacity="0.95" />
      <path d="M0 900 L200 820 L380 890 L560 790 L760 880 L1080 810 V920 H0Z" fill="#241a3d" />
      <rect y="900" width="1080" height="1020" fill="#1c1630" />
      <polygon points="470,900 610,900 1320,1920 -240,1920" fill="#2a2540" />
      <polygon points="470,900 485,900 -240,1920 -300,1920" fill={C.accent} opacity="0.7" />
      <polygon points="610,900 595,900 1320,1920 1380,1920" fill={C.accent} opacity="0.7" />
      {dashes}
      {/* windscreen frame + dashboard */}
      <polygon points="0,0 150,0 40,1250 0,1250" fill="#07060d" />
      <polygon points="1080,0 930,0 1040,1250 1080,1250" fill="#07060d" />
      <path d="M0 1500 Q540 1380 1080 1500 V1920 H0Z" fill="#07060d" />
      <circle cx="540" cy="1780" r="260" fill="none" stroke="#1d1a30" strokeWidth="46" />
      <circle cx="540" cy="1780" r="260" fill="none" stroke="#2c2848" strokeWidth="6" />
      <rect x="470" y="1700" width="140" height="40" rx="20" fill="#1d1a30" />
    </svg>
  );
};

const Robot: React.FC<{ x: number; y: number; k: number; phase: number }> = ({ x, y, k, phase }) => {
  const f = useCurrentFrame();
  const dy = Math.sin(f / 18 + phase) * 16;
  return (
    <g transform={`translate(${x} ${y + dy}) scale(${k})`}>
      <line x1="0" y1="-120" x2="0" y2="-80" stroke={C.dim} strokeWidth="6" />
      <circle cx="0" cy="-128" r="10" fill={C.accent} />
      <rect x="-70" y="-80" width="140" height="110" rx="30" fill="#d7dcf5" />
      <rect x="-48" y="-56" width="96" height="46" rx="20" fill="#0b1020" />
      <circle cx="-22" cy="-33" r="9" fill={C.accent2} />
      <circle cx="22" cy="-33" r="9" fill={C.accent2} />
      <rect x="-55" y="40" width="110" height="90" rx="22" fill="#aab2dd" />
      <rect x="-95" y="48" width="30" height="70" rx="15" fill="#aab2dd" />
      <rect x="65" y="48" width="30" height="70" rx="15" fill="#aab2dd" />
    </g>
  );
};

const Drone: React.FC<{ x: number; y: number; phase: number }> = ({ x, y, phase }) => {
  const f = useCurrentFrame();
  const dy = Math.sin(f / 14 + phase) * 12;
  const blur = Math.sin(f * 2.2) > 0 ? 1 : 0.35;
  return (
    <g transform={`translate(${x} ${y + dy})`}>
      <ellipse cx="0" cy="0" rx="42" ry="18" fill="#d7dcf5" />
      <circle cx="0" cy="-2" r="8" fill={C.accent} />
      {[-70, 70].map((dx) => (
        <g key={dx}>
          <line x1={dx * 0.55} y1="0" x2={dx} y2="-14" stroke={C.dim} strokeWidth="5" />
          <ellipse cx={dx} cy="-18" rx="34" ry="6" fill={C.ink} opacity={blur} />
        </g>
      ))}
    </g>
  );
};

export const CockpitArt: React.FC = () => {
  const f = useCurrentFrame();
  const stars = Array.from({ length: 40 }, (_, i) => {
    const sx = (i * 197) % 920 + 80;
    const sy = (i * 331) % 1000 + 300;
    return (
      <circle key={i} cx={sx} cy={sy} r={2 + (i % 3)} fill={C.ink}
        opacity={0.4 + 0.5 * Math.abs(Math.sin(f / 20 + i))} />
    );
  });
  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      <Sky id="ks" top="#050816" bottom="#2a1f5c" />
      <rect width="1080" height="1920" fill="url(#ks)" />
      {stars}
      <circle cx="800" cy="520" r="150" fill="#3b2b86" />
      <circle cx="760" cy="480" r="150" fill="#050816" opacity="0.35" />
      <Robot x={300} y={820} k={1.5} phase={0} />
      <Robot x={620} y={1010} k={1} phase={2} />
      <Drone x={800} y={760} phase={1} />
      <Drone x={180} y={1060} phase={3} />
      <Drone x={930} y={1060} phase={5} />
      {/* cockpit window frame */}
      <path d="M0 0 H1080 V1920 H0Z M90 230 Q90 200 120 200 H960 Q990 200 990 230 V1290 H90Z"
        fill="#0a0d1d" fillRule="evenodd" />
      <rect x="90" y="200" width="900" height="1090" rx="40" fill="none" stroke="#2c3563" strokeWidth="10" />
      <path d="M0 1290 H1080 V1920 H0Z" fill="#0a0d1d" />
      <rect x="160" y="1380" width="760" height="300" rx="36" fill="#131a38" stroke="#2c3563" strokeWidth="6" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={240 + i * 120} cy={1460} r="16"
          fill={i % 2 ? C.accent2 : C.accent}
          opacity={0.5 + 0.5 * Math.abs(Math.sin(f / 10 + i))} />
      ))}
      <rect x="240" y="1540" width="600" height="18" rx="9" fill="#2c3563" />
      <rect x="240" y="1540" width={600 * (0.35 + 0.1 * Math.sin(f / 30))} height="18" rx="9" fill={C.accent2} />
    </svg>
  );
};
