import { when, hasCount } from "../utils";
import { FormatArticleDataResult } from "../utils/map";
import { Anchor } from "./Anchor";

type ParsedSectionTitle = {
  id: string;
  title: string;
};

export function SideAnchor({ data, scrollContainer }: { data: FormatArticleDataResult, scrollContainer?: HTMLElement | Window | null }) {
  const { abstracts, kwdGroups, titleList, refList } = data;

  const anchorList: ParsedSectionTitle[] = [
    when(hasCount(abstracts), { id: "abstracts", title: "摘要" }),
    when(hasCount(kwdGroups[0]?.keywords), { id: "keywords", title: "关键词" }),
    ...titleList,
    when(hasCount(refList), { id: "references", title: "参考文献" }),
  ].filter((anchor): anchor is ParsedSectionTitle => !!anchor);

  return (
    <Anchor
      items={anchorList}
      offsetTop={20}
      scrollContainer={scrollContainer}
    />
  )
}