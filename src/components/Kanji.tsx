import * as React from "react";
import { HTMLAttributes, useState, useEffect } from "react";

type Props = {
  char: string;
  filterSVG?: (svg: SVGElement) => SVGElement | null;
} & HTMLAttributes<HTMLElement>;

const fetchKanjiSVG = async (char: string) => {
  const code = char.charCodeAt(0).toString(16).toLowerCase().padStart(5, "0");
  const resp = await fetch(`./kanjivg/${code}.svg`);

  const svgXML = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgXML, "image/svg+xml");

  const svg = doc.querySelector("svg")!;
  svg.removeAttribute("height");
  svg.removeAttribute("width");

  return svg;
};

export const Kanji: React.FC<Props> = (props) => {
  const { char, filterSVG, ...domProps } = props;
  const [svg, setSvg] = useState<string>();

  useEffect(() => {
    if (!char) return;

    const filter = filterSVG ?? ((svg: SVGElement) => svg);
    fetchKanjiSVG(char).then((svg) => {
      const filteredSVG = filter(svg);
      if (filteredSVG) {
        setSvg(filteredSVG.outerHTML);
      }
    });
  }, [char, filterSVG]);

  return (
    <div
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
      {...domProps}
    />
  );
};
