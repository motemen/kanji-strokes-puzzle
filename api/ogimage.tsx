import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

export default async function handler(request: Request) {
  return new ImageResponse(
    (
      <div>
        <img
          width="256"
          height="256"
          src={"https://kanji-strokes-puzzle.vercel.app/kanjivg/0672c.svg"}
        />
      </div>
    )
  );
}
