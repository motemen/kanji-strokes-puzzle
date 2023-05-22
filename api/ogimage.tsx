import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

const image = fetch(
  new URL("../public/kanjivg/0f9a8.svg", import.meta.url)
).then((res) => res.arrayBuffer());
export default async function handler(request: Request) {
  const imageData = await image;

  return new ImageResponse(
    (
      <div>
        <img width="256" height="256" src={imageData} />
      </div>
    )
  );
}
