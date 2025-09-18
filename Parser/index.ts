import { parseAuthors, type Author } from "./parseAuthors";
import { parseAbstracts, type ParsedAbstract } from "./parseAbstracts";
import { parseAffiliations, type ParsedAffiliation } from "./parseAffiliations";
import { parseTables, type ParsedTable } from "./parseTables";
import { parseFigures, type ParsedFigure } from "./parseFigures";
import { parseSectionTitles, type ParsedSectionTitle } from "./parseSectionTitles";
import { parseJournalMeta, type ParsedJournalMeta } from "./parseJournalMeta";
import {
  parseArticleMeta,
  type ParsedArticleMeta,
  type Title,
  type KeywordGroup,
  type PubDate,
} from "./parseArticleMeta";
import { parseBack, type References, type ParsedBack } from "./parseBack";
import { XMLUtils } from "./XMLUtils";

/** --- 解析结果 --- */
export type XMLParserResult = {
  // 文档结构节点
  bodyNode: Element | null;
  back: ParsedBack | undefined;

  // 语言
  mainLang: string;
  otherLanguages: string[];

  // 元数据
  journalMeta: ParsedJournalMeta | undefined;
  articleMeta: ParsedArticleMeta | undefined;

  // 文章标识符
  doi: string;
  cstr: string;

  // 发表日期
  pub: PubDate | undefined;
  epub: PubDate | undefined;

  // 附加信息
  figures: ParsedFigure[];
  tables: ParsedTable[];
  titleList: ParsedSectionTitle[];
  refList: References[];
  kwdGroups: KeywordGroup[];
  titleGroup: Title[];
  abstracts: ParsedAbstract[];
  authors: Author[];
  affiliations: ParsedAffiliation[];
};

/** --- 主函数 --- */
export function xmlParser({ xml }: { xml: string }): XMLParserResult {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, "text/xml");

  const errorNode = xmlDoc.getElementsByTagName("parsererror")[0];
  if (errorNode) console.error("Parse error:", errorNode.textContent);

  const article = XMLUtils.getFirstElement(xmlDoc, "article");
  const mainLang = article?.getAttribute("xml:lang") ?? "";
  const otherLanguages = XMLUtils.getOtherLanguages(xmlDoc, mainLang);

  const frontNode = XMLUtils.getFirstElement(xmlDoc, "front");
  const bodyNode = XMLUtils.getFirstElement(xmlDoc, "body");
  const backNode = XMLUtils.getFirstElement(xmlDoc, "back");

  const articleMetaElement = frontNode ? XMLUtils.getFirstElement(frontNode, "article-meta") : null;
  const journalMetaElement = frontNode ? XMLUtils.getFirstElement(frontNode, "journal-meta") : null;

  const articleMeta = articleMetaElement ? parseArticleMeta(articleMetaElement, mainLang) : undefined;
  const journalMeta = journalMetaElement ? parseJournalMeta(journalMetaElement, mainLang) : undefined;
  const back = backNode ? parseBack(backNode) : undefined;

  const doi = articleMeta?.articleIds.find((item) => item.type === "doi")?.value ?? "";
  const cstr = articleMeta?.articleIds.find((item) => item.type === "cstr")?.value ?? "";
  const pub = articleMeta?.pubDates.find((item) => item.type === "pub");
  const epub = articleMeta?.pubDates.find((item) => item.type === "epub");

  const figures = bodyNode ? parseFigures(bodyNode) : [];
  const tables = bodyNode ? parseTables(bodyNode) : [];
  const titleList = bodyNode ? parseSectionTitles(bodyNode) : [];
  const refList = back?.references ?? [];
  const kwdGroups = articleMeta?.keywords ?? [];
  const titleGroup = articleMeta?.titles ?? [];
  const abstracts = articleMetaElement ? parseAbstracts(articleMetaElement, mainLang) : [];
  const authors = articleMetaElement ? parseAuthors(articleMetaElement, mainLang) : [];
  const affiliations = articleMetaElement ? parseAffiliations(articleMetaElement, mainLang) : [];

  return {
    // 节点
    bodyNode,
    back,

    // 语言
    mainLang,
    otherLanguages,

    // 元数据
    journalMeta,
    articleMeta,

    // 标识符
    doi,
    cstr,

    // 日期
    pub,
    epub,

    // 附加信息
    figures,
    tables,
    titleList,
    refList,
    kwdGroups,
    titleGroup,
    abstracts,
    authors,
    affiliations,
  };
}
