import { prefetch } from "remotion";
import type { Rocket } from "../src/config";
import { getIssuesSoundsToPrefetch } from "./Issues";
import { getMainAssetsToPrefetch } from "./Main";
import { getTakeOffAssetToPrefetch } from "./Opening/TakeOff";
import { getSideRocketSource } from "./Spaceship";
import { starsAssetsToPreload } from "./StarsGiven/Star";
import { getFrontRocketSource } from "./TopLanguages/svgs/FrontRocketSource";

export const collectAllAssetsToPrefetch = ({
  rocket,
}: {
  rocket: Rocket;
}): string[] => {
  const sideRocket = getSideRocketSource(rocket);
  const frontRocket = getFrontRocketSource(rocket);

  return [
    sideRocket,
    frontRocket,
    ...getMainAssetsToPrefetch(),
    ...getTakeOffAssetToPrefetch(),
    ...starsAssetsToPreload(),
    ...getIssuesSoundsToPrefetch(),
  ];
};

export const prefetchAllAssets = ({
  rocket,
  onProgress,
  onError,
}: {
  rocket: Rocket;
  onProgress: (percentage: number) => void;
  onError: (error: Error) => void;
}) => {
  const assets = collectAllAssetsToPrefetch({ rocket });

  let assetsLoaded = 0;

  const reportProgress = () => {
    const progress = assetsLoaded / assets.length;
    onProgress(progress);
  };

  assets.forEach((asset) => {
    prefetch(asset)
      .waitUntilDone()
      .then(() => {
        assetsLoaded++;
        reportProgress();
      })
      .catch((err) => onError(err));
  });
};