import React from "react";
import { Composition } from "remotion";
import { Short } from "./Short";
import { data } from "./data";
import { Thumb } from "./Thumb";

export const Root: React.FC = () => (
  <>
  <Composition id="Thumb" component={Thumb} width={1280} height={720} fps={30} durationInFrames={1} />
  <Composition
    id="Short"
    component={Short}
    width={data.width}
    height={data.height}
    fps={data.fps}
    durationInFrames={Math.ceil(data.total_seconds * data.fps)}
  />
  </>
);
