import { TransitionSeries, springTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { Sequence } from "remotion";
import { z } from "zod";
import { PlanetScaleWiggle } from "./PlaneScaleWiggle";
import { PlanetScaleOut } from "./PlanetScaleOut";
import {
  PlanetScaleSpiral,
  startRotationInRadiansSchema,
} from "./PlanetScaleSpiral";
import type { LanguageType } from "./constants";
import { LanguagesEnum } from "./constants";
import { cornerType } from "./corner";
import { ShowDescription } from "./sequences/ShowDescription";

export const allPlanetsSchema = z.object({
  language1: LanguagesEnum,
  language2: LanguagesEnum.or(z.null()),
  language3: LanguagesEnum.or(z.null()),
  corner: cornerType,
  showHelperLine: z.boolean(),
  startRotationInRadians: startRotationInRadiansSchema,
});

export const allPlanetsTransitionTiming = springTiming({
  config: {
    damping: 200,
  },
  durationInFrames: 15,
});

const TITLE_CARD_DURATION = 70;
const FIRST_PLACE_DURATION = 120;
const SECOND_PLACE_DURATION = 120;
const THIRD_PLACE_DURATION = 110;

export const getDurationOfAllPlanets = ({
  language2,
  language3,
  fps,
}: {
  language2: LanguageType | null;
  language3: LanguageType | null;
  fps: number;
}) => {
  const transitionDuration = allPlanetsTransitionTiming.getDurationInFrames({
    fps,
  });

  const transitionBetween1And2 = language2 ? -transitionDuration : 0;
  const transitionBetween2And3 = language3 ? -transitionDuration : 0;

  const thirdDuration = language3 ? THIRD_PLACE_DURATION : 0;
  const secondDuration = language2 ? SECOND_PLACE_DURATION : 0;

  return (
    TITLE_CARD_DURATION +
    thirdDuration +
    secondDuration +
    FIRST_PLACE_DURATION +
    transitionBetween1And2 +
    transitionBetween2And3 -
    transitionDuration
  );
};

export const AllPlanets: React.FC<z.infer<typeof allPlanetsSchema>> = ({
  language1,
  language2,
  language3,
  corner,
  showHelperLine,
  startRotationInRadians,
}) => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={TITLE_CARD_DURATION}>
        <Sequence
          style={{
            overflow: "hidden",
          }}
        >
          <Sequence from={-45}>
            <ShowDescription first="Java" second="JavaScript" third="Python" />
          </Sequence>
        </Sequence>
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={allPlanetsTransitionTiming}
      />
      {language3 ? (
        <>
          <TransitionSeries.Sequence durationInFrames={THIRD_PLACE_DURATION}>
            <PlanetScaleOut position={3} corner={corner} language={language3} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={slide({ direction: "from-top" })}
            timing={allPlanetsTransitionTiming}
          />
        </>
      ) : null}
      {language2 ? (
        <>
          <TransitionSeries.Sequence
            style={{
              overflow: "hidden",
            }}
            durationInFrames={SECOND_PLACE_DURATION}
          >
            <PlanetScaleSpiral
              showHelperLine={showHelperLine}
              language={language2}
              startRotationInRadians={startRotationInRadians}
              position={2}
            />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={slide({ direction: "from-top" })}
            timing={allPlanetsTransitionTiming}
          />
        </>
      ) : null}
      <TransitionSeries.Sequence
        durationInFrames={FIRST_PLACE_DURATION}
        style={{
          overflow: "hidden",
        }}
      >
        <PlanetScaleWiggle position={1} language={language1} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};