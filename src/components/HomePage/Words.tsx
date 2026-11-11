import { Fragment, type CSSProperties } from "react";

interface WordsProps {
  text: string;
  wordClassName: string;
  /** Index of the first word, to continue a sequence started by an earlier <Words>. */
  startIndex?: number;
}

/**
 * Splits text into per-word spans for CSS word-by-word animation. Each word exposes
 * `--i` (its index) and `--p` (its position through the text, 0 to 1).
 */
export function Words({ text, wordClassName, startIndex = 0 }: WordsProps) {
  const words = text.split(" ");
  const last = Math.max(words.length - 1, 1);

  return words.map((word, index) => (
    <Fragment key={index}>
      <span className={wordClassName} style={{ "--i": startIndex + index, "--p": index / last } as CSSProperties}>
        {word}
      </span>{" "}
    </Fragment>
  ));
}
