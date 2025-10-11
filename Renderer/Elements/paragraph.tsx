import { PropsWithChildren } from "react";
import { TranslationIndicator } from "../../components";

interface Props {
  id: string;
  __depth: number;
  node: Element;
}

export const Paragraph = ({
  id,
  node,
  __depth,
  children,
}: PropsWithChildren<Props>) => {
  const isText = typeof children === "string";
  const Wrapper = isText ? "p" : "div";

  const textContent = Array.from(node.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent)
    .join("");

  return (
    <Wrapper className="text-sm leading-7" id={id} data-depth={__depth}>
      {children}
      {/* <TranslationIndicator content={textContent} /> */}
    </Wrapper>
  );
};
