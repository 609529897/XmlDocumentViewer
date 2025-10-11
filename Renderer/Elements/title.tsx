import { PropsWithChildren } from "react";
import { TranslationIndicator } from "../../components";

interface Props {
  __depth: number;
  node: Element;
}

export function Title({ __depth, children, node }: PropsWithChildren<Props>) {
  const sizeMap = {
    1: "lg",
    2: "base",
    3: "sm",
  };

  const HeadingTag = `h${Math.min(__depth, 4)}` as keyof JSX.IntrinsicElements;
  const size = sizeMap[__depth as keyof typeof sizeMap] || "sm";

  const textContent = Array.from(node.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent)
    .join("");

  return (
    <HeadingTag className={`text-${size} font-semibold my-4 inline-block`}>
      {children} 
      {/* <TranslationIndicator content={textContent} /> */}
    </HeadingTag>
  );
}
