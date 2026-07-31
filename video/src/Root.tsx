import "./index.css";
import { Composition } from "remotion";
import { Demo } from "./Demo";
import { Tour } from "./Tour";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Short loop for the README */}
      <Composition
        id="Demo"
        component={Demo}
        durationInFrames={18 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* Full product tour — 45s, for LinkedIn and launch posts */}
      <Composition
        id="Tour"
        component={Tour}
        durationInFrames={Math.round(45.4 * 30)}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* Square cut — feeds give 1:1 more vertical real estate */}
      <Composition
        id="TourSquare"
        component={Tour}
        durationInFrames={Math.round(45.4 * 30)}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};
