export type ParsedJournalMeta = ReturnType<typeof parseJournalMeta>

export function parseJournalMeta(journalMeta: Element, defaultLang: string) {
  if (!journalMeta) return null;

  // journal-id
  const journalIds = Array.from(journalMeta.querySelectorAll("journal-id")).map((id) => ({
    type: id.getAttribute("journal-id-type") ?? "",
    value: id.textContent?.trim() ?? "",
  }));

  // 主标题组
  const titleGroup = journalMeta.querySelector("journal-title-group");
  const titles: { title: string; subtitle: string; lang: string }[] = [];

  if (titleGroup) {
    // 默认英文
    const mainTitle = titleGroup.querySelector("journal-title")?.textContent?.trim() ?? "";
    const mainSubtitle =
      titleGroup.querySelector("journal-subtitle")?.textContent?.trim() ?? "";
    titles.push({ title: mainTitle, subtitle: mainSubtitle, lang: defaultLang });

    // 翻译
    const transGroups = Array.from(titleGroup.querySelectorAll("trans-title-group"));
    for (const tg of transGroups) {
      titles.push({
        title: tg.querySelector("trans-title")?.textContent?.trim() ?? "",
        subtitle: tg.querySelector("trans-subtitle")?.textContent?.trim() ?? "",
        lang: tg.getAttribute("xml:lang") ?? defaultLang,
      });
    }
  }

  // 缩写
  const abbrevTitles = Array.from(
    journalMeta.querySelectorAll("journal-title-group > abbrev-journal-title")
  ).map((node) => ({
    type: node.getAttribute("abbrev-type") ?? "",
    value: node.textContent?.trim() ?? "",
  }));

  // ISSN
  const issns = Array.from(journalMeta.querySelectorAll("issn")).map((issn) => ({
    format: issn.getAttribute("publication-format") ?? "",
    value: issn.textContent?.trim() ?? "",
  }));

  // 其他出版信息
  const cn = journalMeta.querySelector("cn")?.textContent?.trim() ?? "";
  const isbn = journalMeta.querySelector("isbn")?.textContent?.trim() ?? "";
  const managedBy =
    journalMeta.querySelector("journal-managed-by")?.textContent?.trim() ?? "";
  const sponsor = journalMeta.querySelector("journal-sponsor")?.textContent?.trim() ?? "";

  // publisher
  const publisherNode = journalMeta.querySelector("publisher");
  const publisher = publisherNode
    ? {
        name: publisherNode.querySelector("publisher-name")?.textContent?.trim() ?? "",
        loc: publisherNode.querySelector("publisher-loc")?.textContent?.trim() ?? "",
      }
    : null;

  // self-uri
  const selfUri = journalMeta.querySelector("self-uri")?.getAttribute("href") ?? "";

  return {
    journalIds,
    titles,
    abbrevTitles,
    issns,
    cn,
    isbn,
    managedBy,
    sponsor,
    publisher,
    selfUri,
  };
}
