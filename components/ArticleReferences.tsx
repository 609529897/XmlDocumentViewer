import { hasCount } from "../utils";
import { References } from "./References";
import { TranslationIndicator } from "./TranslationIndicator";
import { FormatArticleDataResult } from "../utils/map";

export function ArticleReferences({ data }: { data: FormatArticleDataResult }) {
  const { refList } = data;
  if (!hasCount(refList)) return null;

  return (
          <section id="references" className="flex flex-col gap-5">
            <TranslationIndicator title="参考文献" showTranslation={false} />
            <References
              data={refList.map((item, i) => ({
                text: item.text,
                id: `references-${i}`,
              }))}
            />
          </section>
  );
}
