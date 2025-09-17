import { parseAuthors } from "./parseAuthors";
import { parseAbstracts } from "./parseAbstracts";
import { parseAffiliations } from "./parseAffiliations";
import { parseTables } from "./parseTables";
import { parseFigures } from "./parseFigures";
import { parseSectionTitles } from "./parseSectionTitles";
import { parseJournalMeta } from "./parseJournalMeta";
import { parseArticleMeta } from "./parseArticleMeta";
import { parseBack, References } from "./parseBack";
import { XMLUtils } from "./XMLUtils";

export type Affiliations = ReturnType<typeof parseAffiliations>
export type Affiliation = Affiliations[number];

export type Authors = ReturnType<typeof parseAuthors>;
export type Author = Authors[number];

export type Date = {
  type: string;
  year: string;
  month: string;
  day: string;
}

type PubDate = {
  string: string;
} & Date;

type Title = {
  title: string;
  subtitle: string;
  lang: string;
}

type kwdGroup = {
  type: string;
  lang: string;
  title: string;
  keywords: string[];
}

export type XMLParserResult = {
  bodyNode: Element | null;
  mainLang: string;
  otherLanguages: string[];
  figures: ReturnType<typeof parseFigures>;
  tables: ReturnType<typeof parseTables>;
  titleList: ReturnType<typeof parseSectionTitles>;
  journalMeta: ReturnType<typeof parseJournalMeta> | undefined;
  articleMeta: ReturnType<typeof parseArticleMeta> | undefined;
  refList: References[]; // 需要补充具体的引用类型
  kwdGroups: kwdGroup[]; // 需要补充具体的关键词类型
  titleGroup: Title[]; // 需要补充具体的标题类型
  back: ReturnType<typeof parseBack> | undefined;
  abstracts: ReturnType<typeof parseAbstracts>;
  authors: Authors;
  affiliations: Affiliations;
  doi: string;
  cstr: string;
  pub: PubDate | undefined; // 需要补充具体的发布日期类型
  epub: PubDate | undefined; // 需要补充具体的电子发布日期类型
}

// todo: 可以直接用 articleMeta 的数据
export function xmlParser({ xml }: { xml: string }): XMLParserResult {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, "text/xml");

  const errorNode = xmlDoc.getElementsByTagName("parsererror")[0];
  if (errorNode) {
    console.error("Parse error:", errorNode.textContent);
  }

  const article = XMLUtils.getFirstElement(xmlDoc, "article");
  const lang = article?.getAttribute("xml:lang") ?? "";
  const otherLanguages = XMLUtils.getOtherLanguages(xmlDoc, lang);

  const frontNode = XMLUtils.getFirstElement(xmlDoc, "front");
  const bodyNode = XMLUtils.getFirstElement(xmlDoc, "body");
  const backNode = XMLUtils.getFirstElement(xmlDoc, "back");

  const articleMetaElement = frontNode ? XMLUtils.getFirstElement(frontNode, "article-meta") : null;
  const journalMetaElement = frontNode ? XMLUtils.getFirstElement(frontNode, "journal-meta") : null;

  // 提前计算需要复用的值
  const hasArticleMeta = !!articleMetaElement;
  const hasJournalMeta = !!journalMetaElement;
  const hasBodyNode = !!bodyNode;
  const hasBackNode = !!backNode;

  const back = hasBackNode ? parseBack(backNode) : undefined;
  const articleMeta = hasArticleMeta ? parseArticleMeta(articleMetaElement, lang) : undefined;
  const journalMeta = hasJournalMeta ? parseJournalMeta(journalMetaElement, lang) : undefined;

  const doi = articleMeta ? articleMeta.articleIds.find((item) => item.type === 'doi')?.value || "" : '';
  const cstr = articleMeta ? articleMeta.articleIds.find((item) => item.type === 'cstr')?.value || "" : '';
  const pub = articleMeta ? articleMeta.pubDates.find((item) => item.type === 'pub') : undefined;
  const epub = articleMeta ? articleMeta.pubDates.find((item) => item.type === 'epub') : undefined;

  return {
    bodyNode,
    mainLang: lang,
    otherLanguages,
    figures: hasBodyNode ? parseFigures(bodyNode) : [],
    tables: hasBodyNode ? parseTables(bodyNode) : [],
    titleList: hasBodyNode ? parseSectionTitles(bodyNode) : [],
    journalMeta,
    articleMeta,
    refList: back ? back.references : [],
    kwdGroups: articleMeta ? articleMeta.keywords : [],
    titleGroup: articleMeta ? articleMeta.titles : [],
    back,
    abstracts: hasArticleMeta ? parseAbstracts(articleMetaElement, lang) : [],
    authors: hasArticleMeta ? parseAuthors(articleMetaElement, lang) : [],
    affiliations: hasArticleMeta ? parseAffiliations(articleMetaElement, lang) : [],
    doi,
    cstr,
    pub,
    epub,
  };
}