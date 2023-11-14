import { noise2D } from "@remotion/noise";
import { reversePath } from "@remotion/paths";
import { interpolate } from "remotion";

const width = 1080;

export const makeRandomPath = (seed: string | number) => {
  const start = { x: width / 2, y: 267.4 };
  const end = { x: width / 2, y: 4274 };

  const numberOfItems = 100;

  const points = new Array(numberOfItems).fill(1).map((a, i) => {
    const progress = interpolate(i, [0, numberOfItems - 1], [0, 1]);

    const x = (noise2D(seed, i / 30, 0) * width) / 2;
    const loweredX = interpolate(progress, [0.6, 0.9], [x, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const st = {
      y: interpolate(progress, [0, 1], [start.y, end.y]),
      x: interpolate(progress, [0, 1], [start.x, end.x]) + loweredX,
    };

    return st;
  });

  const p = points
    .map((p) => {
      if (p === points[0]) {
        return `M${p.x} ${p.y}`;
      }

      return `L${p.x} ${p.y}`;
    })
    .join(" ");

  return reversePath(p);
};