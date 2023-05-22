import { useCallback, useEffect, useState } from "react";
import useSWRImmutable from "swr/immutable";
import { Transition } from "@headlessui/react";
import { StringParam, useQueryParam } from "use-query-params";
import { ForwardIcon, LightBulbIcon } from "@heroicons/react/20/solid";

import "./App.css";
import { Kanji } from "./components/Kanji";

const keepLastStroke = 2;
interface LevelSpec {
  key: string;
  name: string;
}

type Level = LevelSpec["key"];

const LEVEL_SPECS: LevelSpec[] = [
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

const KanjiText: React.FC<{ word: string | null }> = ({ word }) => {
  const [loadCount, setLoadCount] = useState(0);

  const onKanjiLoaded = useCallback(() => {
    setLoadCount((n) => n + 1);
  }, []);

  return (
    <>
      {(word || "\x00\x00").split("").map((char, i) => (
        <div
          key={i}
          className="lg:w-64 lg:h-64 w-1/2 aspect-square inline-block border"
        >
          <Transition
            show={loadCount >= 2}
            unmount={false}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
          >
            {char === "\x00" ? (
              <div className="w-full h-full"></div>
            ) : (
              <Kanji
                char={char}
                filterSVG={filterSVG}
                onKanjiLoad={onKanjiLoaded}
              />
            )}
          </Transition>
        </div>
      ))}
    </>
  );
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

  const { data: words } = useSWRImmutable(
    "/data/jawiktionary-2kanji-nouns.txt",
    async (url) => {
      const resp = await fetch(url);
      const text = await resp.text();
      return text.split("\n").filter((word) => word.length === 2);
    }
  );

  const { data: kanjiSet } = useSWRImmutable(
    `/data/kanji-${level.key}.txt`,
    async (url) => {
      const resp = await fetch(url);
      const text = await resp.text();
      return new Set(text.split(/\n/));
    }
  );

  const { data: word, mutate: mutateWord } = useSWRImmutable(
    words && kanjiSet && [words, kanjiSet],
    async ([words, kanjiSet]) => {
      const filtered = words.filter(
        (word) => kanjiSet.has(word[0]) && kanjiSet.has(word[1])
      );
      return filtered[Math.floor(Math.random() * filtered.length)];
    }
  );

  const resetWord = () => {
    mutateWord();
    setReveal(false);
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="flex-grow flex flex-col w-full">
        <div
          className={`mt-24 flex flex-row justify-center ${
            reveal ? "kanji-stroke-reveal" : ""
          }`}
        >
          <div className="max-w-full px-4">
            <div className="mt-8 space-x-3">
              <label>
                レベル:{" "}
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

            <div className="mt-8 space-x-4 flex">
              <KanjiText key={word} word={word ?? null} />
            </div>

            <div className="mt-6 space-x-3">
              <button
                className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-lg"
                onClick={() => setReveal(true)}
              >
                <LightBulbIcon className="w-4 h-4 inline-block mr-1" />
                答えを見る
              </button>

              <button
                className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-lg"
                onClick={() => {
                  resetWord();
                }}
              >
                <ForwardIcon className="w-4 h-4 inline-block mr-1" />
                次の問題
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-none text-center p-4">
        <address className="text-sm text-slate-500">
          Kanji SVG files are from{" "}
          <a
            className="text-blue-500 underline"
            href="http://kanjivg.tagaini.net/"
          >
            KanjiVG
          </a>{" "}
          by Ulrich Apel, licensed under{" "}
          <a
            className="text-blue-500 underline"
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
