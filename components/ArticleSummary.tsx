import { hasCount } from "../utils";
import { Abstracts } from "./Abstracts";
import { Keywords } from "./Keywords";
import { TranslationIndicator } from "./TranslationIndicator";
import { FormatArticleDataResult } from "../utils/map";

export function ArticleSummary({ data }: { data: FormatArticleDataResult }) {
  const { abstracts, kwdGroups } = data;

  // 提取非图形类摘要文本
  const abstractText = abstracts
    .filter(
      (item) =>
        item.type !== "graphic" &&
        item.type !== "graphical" &&
        item.type !== "media"
    )
    .map((item) => item.paragraphs.join(""))
    .join("\n");

  // 提取关键词列表
  const firstKwdGroup = kwdGroups[0];
  const keywords = firstKwdGroup?.keywords ?? [];

  return (
    <>
      {hasCount(abstracts) && (
        <section id="abstracts" className="flex flex-col gap-4">
          <div className="text-xl font-semibold flex gap-1.5 items-center">
            摘要
            <TranslationIndicator content={abstractText} />
          </div>
          <div className="text-sm text-[var(--kx-text-2)] leading-7">
            <Abstracts data={abstracts} />
          </div>
        </section>
      )}

      {hasCount(keywords) && (
        <section id="keywords" className="flex flex-col gap-4">
          <div className="text-xl font-semibold flex gap-1.5 items-center">
            关键词
            <TranslationIndicator content={keywords.join(", ")} />
          </div>
          <Keywords keywords={keywords} />
        </section>
      )}
    </>
  );
}
