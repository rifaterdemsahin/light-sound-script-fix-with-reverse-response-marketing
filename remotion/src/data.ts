import raw from "../public/data.json";

export type Scene = {
  id: number;
  act: string;
  start: number;
  end: number;
  type: string;
  voice: string | null;
  text?: string;
  sub?: string;
  art?: string;
  callout?: string;
  quote?: string;
  steps?: string[];
  image?: string;
  words?: { w: string; t0: number; t1: number }[];
};

export type Data = {
  title: string;
  fps: number;
  width: number;
  height: number;
  total_seconds: number;
  cta_url: string;
  scenes: Scene[];
};

export const data = raw as unknown as Data;
