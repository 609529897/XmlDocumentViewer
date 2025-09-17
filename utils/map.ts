import type { XMLParserResult, Author, Affiliation, Date } from "../Parser";
import type { References } from "../Parser/parseBack";
import { filterByLang, formatDate, uniqueArray } from "./common";
import { formatGBT7714Reference } from "./format";

/** -------------------------
 * 工具函数
 * ------------------------- */

/** 获取作者完整姓名 */
function getAuthorFullName(author: Author): string {
  return author.fullName || Object.values(author.nameLangMap || {}).find(Boolean) || "";
}

/** 获取作者对应机构信息 */
function getAuthorAffiliations(author: Author, affiliations: Affiliation[]): Affiliation[] {
  return author.xrefs?.aff ? author.xrefs.aff
    .map(id => affiliations.find(aff => aff.id === id))
    .filter(Boolean) as Affiliation[] : [];
}

/** 生成作者机构索引（1,2,3） */
function getAffiliationIndex(author: Author, affiliations: Affiliation[]): string {
  return author.xrefs?.aff ? author.xrefs.aff
    .map(id => affiliations.findIndex(aff => aff.id === id) + 1)
    .filter(i => i > 0)
    .join(",") : '';
}

/** 格式化作者详情字符串 */
function formatAuthorDetail(author: Author, affiliations: Affiliation[]): string {
  const fullName = getAuthorFullName(author);
  const authorAffs = getAuthorAffiliations(author, affiliations);
  return [
    fullName,
    ...authorAffs.map(aff => aff.institutions ? aff.institutions.join("") : "").filter(Boolean),
    ...uniqueArray(author.email || []),
  ].join("，");
}

/** 格式化机构地址 */
function formatAffiliationAddress(aff: Affiliation, mainLang: string): string {
  if (aff.address?.length) {
    const addr = filterByLang(aff.address, mainLang)[0]?.full;
    return [addr, aff.postalCode].filter(Boolean).join(" ");
  }
  return [aff.city, aff.state, aff.country, aff.postalCode].filter(Boolean).join(" ");
}

/** 格式化参考文献 */
function formatReferenceList(refList: References[], mainLang: string): { id: string; text: string }[] {
  return refList.map((item, idx) => ({
    id: item.id,
    text: formatGBT7714Reference({
      index: idx + 1,
      issue: item.issue,
      authors: item.authors.map(a => a.fullName || ""),
      title: item.articleTitle || "",
      journal: item.publisherName || "",
      year: Number(item.year) || 0,
      volume: item.volume || "",
      lang: mainLang,
    }),
  }));
}

/** 获取指定类型的日期 */
function getPublicationDate(dates: Date[], type: string): string | undefined {
  return formatDate(dates.find(d => d.type === type));
}

/** -------------------------
 * 主函数
 * ------------------------- */

export function formatArticleData(parsedData: XMLParserResult) {
  const {
    authors,
    affiliations,
    titleGroup,
    abstracts,
    kwdGroups,
    refList,
    back,
    articleMeta,
    mainLang,
    journalMeta,
  } = parsedData;

  // -------------------------
  // 标题、摘要、关键词处理
  // -------------------------
  const filteredTitleGroup = filterByLang(titleGroup, mainLang);
  const filteredAbstracts = filterByLang(abstracts, mainLang);
  const filteredKwdGroups = filterByLang(kwdGroups, mainLang);
  const filteredAffiliations = filterByLang(affiliations, mainLang);
  const title = filteredTitleGroup[0]?.title || titleGroup.find(t => t.title)?.title || "";

  // -------------------------
  // 作者信息处理
  // -------------------------
  const formattedAuthors = authors.map((author: Author) => {
    const fullName = getAuthorFullName(author);

    return {
      ...author,
      fullName,
      email: uniqueArray(author.email || []),
      affiliations: author.xrefs?.aff || [],
      corresp: author.xrefs?.corresp || [],
      detail: formatAuthorDetail(author, filteredAffiliations),
      affiliationIndex: getAffiliationIndex(author, filteredAffiliations),
    };
  });

  // -------------------------
  // 机构信息处理
  // -------------------------
  const formattedAffiliations = filteredAffiliations.map((aff: Affiliation) => ({
    ...aff,
    id: aff.id,
    name: aff.institutions ? aff.institutions.join("") : "",
    institutions: aff.institutions,
    address: formatAffiliationAddress(aff, mainLang),
  }));

  // -------------------------
  // 通讯作者
  // -------------------------
  const correspAuthors = authors.filter(a => a.isCorresponding).map(a => a.fullName);

  // -------------------------
  // 作者备注 & 贡献
  // -------------------------
  const notes = articleMeta?.correspNotes || [];
  const contributions = back?.notes.filter(n => n.type === "con").map(n => n.text) || [];

  // -------------------------
  // 参考文献
  // -------------------------
  const formattedReferenceList = formatReferenceList(refList, mainLang);


  const fundInformation = articleMeta ? articleMeta.fundingGroups
    .flatMap((g) => g.sources)
    .filter((s) => s.lang === mainLang)
    .map((s) => s.value)
    .join(',') || '' : "";

  // -------------------------
  // 杂志信息 & 分类
  // -------------------------
  const journalName = journalMeta ? journalMeta.titles.find((t) => t.lang === mainLang)?.title || '' : "";

   const column = articleMeta ?
    articleMeta.categories
      ?.filter((item) => item.type === 'heading' && (item.lang === mainLang))
      .flatMap((h) => h.subjects || [])
      .join(',') || '' : "";

  // -------------------------
  // 利益冲突声明
  // -------------------------
  const conflict = articleMeta ? articleMeta.footnotes.find(f => f.type === "conflict")?.text
    || back?.notes.find(n => n.type === "COI-statement")?.text
    || "" : "";

  // -------------------------
  // 出版日期
  // -------------------------
  const allDates = articleMeta ? [...articleMeta.pubDates, ...articleMeta.history] : [];
  const publicationDates = [
    { label: "投稿时间", value: getPublicationDate(allDates, "received") },
    { label: "修订时间", value: getPublicationDate(allDates, "rev-recd") },
    { label: "录用时间", value: getPublicationDate(allDates, "accepted") },
    { label: "纸质出版时间", value: getPublicationDate(allDates, "pub") },
    { label: "网络出版时间", value: getPublicationDate(allDates, "epub") },
  ].filter(d => d.value);
  

  // -------------------------
  // 返回整合结果
  // -------------------------
  return {
    ...parsedData,
    fundInformation,
    journalName,
    publicationDates,
    column,
    conflict,
    title,
    titleGroup: filteredTitleGroup,
    abstracts: filteredAbstracts,
    kwdGroups: filteredKwdGroups,
    authors: formattedAuthors,
    affiliations: formattedAffiliations,
    refList: formattedReferenceList,
    correspAuthors,
    notes,
    contributions,
  };
}

export type FormatArticleDataResult = ReturnType<typeof formatArticleData>

// 多语言元数据map
export const mapMetaData = (data: XMLParserResult) => {

  const {
  mainLang,
  authors,
  refList,
  affiliations,
  articleMeta,
  journalName,
  abstracts,
  kwdGroups,
  title,
  doi,
  cstr,
  pub,
  epub,
  fundInformation,
  column,
  } = formatArticleData(data);

  const institutions = affiliations
    .map((a) => ({
      id: a.id || "",
      name: a.institutions ? a.institutions.join('') : "",
    }));

  const authorsMapped = authors
    .map((author) => {
      const affs = affiliations
        .filter((aff) => author.xrefs?.aff ? author.xrefs.aff.includes(aff.id || '') : false)
        .map((aff) => aff.institutions ? aff.institutions.join('') : "");

      return {
        id: '',
        name: author.nameLangMap ? author.nameLangMap[mainLang || ''] : "",
        affiliations: affs,
        email: author.email,
        stid: author.id || "",
        affIds: author.xrefs?.aff || [],
      };
    })
    .filter((a) => Boolean(a.name));


  const keywords = kwdGroups[0].keywords.map((kw) => ({ keyword: kw })) || [];

  return {
    authors: authorsMapped,
    refList: refList,
    fundInformation,
    abstract: abstracts,
    institutions,
    keywords,
    volume: articleMeta?.volume || "",
    issue: articleMeta?.issue || "",
    journalName,
    column,
    title,
    doi,
    cstr,
    journalId: '',
    printPublicationDate: formatDate(pub),
    onlinePublicationDate: formatDate(epub),
  };
};