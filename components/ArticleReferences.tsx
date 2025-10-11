import { hasCount } from "../utils";
import { References } from "./References";
import { FormatArticleDataResult } from "../utils/map";

export function ArticleReferences({ data }: { data: FormatArticleDataResult }) {
  const { refList } = data;
  if (!hasCount(refList)) return null;

  return (
    <section id="references" className="flex flex-col gap-5">
      <div className="text-xl font-semibold">参考文献</div>
      <References
        data={refList.map((item, i) => ({
          text: item.text,
          id: `references-${i}`,
        }))}
      />
    </section>
  );
}
