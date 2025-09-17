import { hasCount } from "../utils";
import { Abstracts } from "./Abstracts";
import { Keywords } from "./Keywords";
import { TranslationIndicator } from "./TranslationIndicator";
import { FormatArticleDataResult } from "../utils/map";

export function ArticleSummary({ data }: { data: FormatArticleDataResult }) {

  const {
    abstracts, kwdGroups
  } = data;

  return (
    <>
     {hasCount(abstracts) && (
          <section id="abstracts" className="flex flex-col gap-4">
            <TranslationIndicator title="摘要" showTranslation={false} />
            <div className="text-sm text-[var(--kx-text-2)] leading-7">
              <Abstracts data={abstracts} />
            </div>
          </section>
        )}

        {hasCount(kwdGroups[0]?.keywords) && (
          <section id="keywords" className="flex flex-col gap-4">
            <TranslationIndicator title="关键词" showTranslation={false} />
            {kwdGroups[0] && <Keywords keywords={kwdGroups[0].keywords} />}
          </section>
        )}

    </>
  );
}
