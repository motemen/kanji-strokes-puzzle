import { useState } from "react";
import useSWRImmutable from "swr/immutable";
import { Transition } from "@headlessui/react";
import { SWRResponse } from "swr";
import { StringParam, useQueryParam } from "use-query-params";

import "./App.css";
import { Kanji } from "./components/Kanji";

const keepLastStroke = 2;
interface LevelSpec {
  key: string;
  name: string;
}

type Level = LevelSpec["key"];

const LEVEL_SPECS = [
  { key: "10", name: "漢検十級" },
  { key: "09", name: "漢検九級" },
  { key: "08", name: "漢検八級" },
  { key: "07", name: "漢検七級" },
  { key: "06", name: "漢検六級" },
  { key: "05", name: "漢検五級" },
  { key: "04", name: "漢検四級" },
  { key: "03", name: "漢検三級" },
  { key: "02j", name: "漢検準二級" },
  { key: "02", name: "漢検二級" },
];

function useKanjiSet(level: Level): SWRResponse<Set<string>> {
  return useSWRImmutable(`/data/kanji-${level}.txt`, (url) =>
    fetch(url).then(async (res) => {
      const text = await res.text();
      return new Set(text.split(/\n/));
    })
  );
}

const filterSVG = (svg: SVGElement) => {
  const paths = svg.querySelectorAll('g[id^="kvg:StrokePaths_"] path');
  [...paths].slice(0, -keepLastStroke).forEach((path) => {
    path.classList.add("kanji-stroke-hidden");
  });
  svg.querySelectorAll('[id^="kvg:StrokeNumbers_"]').forEach((path) => {
    path.remove();
  });
  return svg;
};

function App() {
  const [reveal, setReveal] = useState(false);
  const [levelKey, setLevelKey] = useQueryParam("level", StringParam);
  const [level, setLevel] = useState(
    LEVEL_SPECS.find(({ key }) => key === levelKey) ?? LEVEL_SPECS[0]
  );
  if (level.key !== levelKey) {
    setLevelKey(level.key);
  }

  const { data: kanjiSet } = useKanjiSet(level.key);

  const { data: words } = useSWRImmutable(
    "/data/jawiktionary-2kanji-nouns.txt",
    async (url) => {
      const resp = await fetch(url);
      const text = await resp.text();
      return text.split("\n").filter((word) => word.length === 2);
    }
  );

  const chooseWord = (words: string[], kanjiSet: Set<string>) => {
    const filtered = words.filter(
      (word) => kanjiSet.has(word[0]) && kanjiSet.has(word[1])
    );
    return filtered[Math.floor(Math.random() * filtered.length)];
  };

  const { data: word, mutate: setWord } = useSWRImmutable(
    words && kanjiSet && [words, kanjiSet],
    async ([words, kanjiSet]) => {
      return chooseWord(words, kanjiSet);
    }
  );

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow flex flex-col w-full">
        <div
          className={`mt-24 flex flex-row justify-center ${
            reveal ? "kanji-stroke-reveal" : ""
          }`}
        >
          <div>
            <div className="mt-8 space-x-3">
              <label className="">
                レベル:&nbsp;
                <select
                  className="px-2 py-1 border"
                  value={level.key}
                  onChange={(ev) => {
                    const lv = LEVEL_SPECS.find(
                      ({ key }) => key === ev.target.value
                    );
                    if (lv) {
                      setReveal(false);
                      setLevel(lv);
                    }
                  }}
                >
                  {LEVEL_SPECS.map((level) => (
                    <option key={level.key} value={level.key}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-8 h-64 space-x-4">
              {(word || "漢字").split("").map((char, i) => (
                <div className="w-64 h-64 inline-block border">
                  <Transition
                    show={!!word}
                    as="div"
                    enter="transition-opacity duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                  >
                    <Kanji key={i} char={char} filterSVG={filterSVG} />
                  </Transition>
                </div>
              ))}
            </div>

            <div className="mt-6 space-x-3">
              <button
                className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-lg"
                onClick={() => setReveal(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  className="w-4 h-4 inline-block mr-1"
                >
                  <path d="M10 1a6 6 0 00-3.815 10.631C7.237 12.5 8 13.443 8 14.456v.644a.75.75 0 00.572.729 6.016 6.016 0 002.856 0A.75.75 0 0012 15.1v-.644c0-1.013.762-1.957 1.815-2.825A6 6 0 0010 1zM8.863 17.414a.75.75 0 00-.226 1.483 9.066 9.066 0 002.726 0 .75.75 0 00-.226-1.483 7.553 7.553 0 01-2.274 0z" />
                </svg>
                答えを見る
              </button>

              <button
                className="bg-gray-200  hover:bg-gray-300 px-3 py-2 rounded text-lg"
                onClick={() => {
                  setWord();
                  setReveal(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 inline-block mr-1"
                >
                  <path d="M3.288 4.819A1.5 1.5 0 001 6.095v7.81a1.5 1.5 0 002.288 1.277l6.323-3.905c.155-.096.285-.213.389-.344v2.973a1.5 1.5 0 002.288 1.276l6.323-3.905a1.5 1.5 0 000-2.553L12.288 4.82A1.5 1.5 0 0010 6.095v2.973a1.506 1.506 0 00-.389-.344L3.288 4.82z" />
                </svg>
                次の問題
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-none text-center p-4">
        <address className="text-sm text-slate-400">
          SVG files are from{" "}
          <a
            className="text-blue-400 underline"
            href="http://kanjivg.tagaini.net/"
          >
            KanjiVG
          </a>{" "}
          by Ulrich Apel, licensed under{" "}
          <a
            className="text-blue-400 underline"
            href="http://creativecommons.org/licenses/by-sa/3.0/"
          >
            CC BY-SA
          </a>
          .
        </address>
      </div>
    </div>
  );
}

export default App;
