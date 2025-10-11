export type ParsedJournalMeta = ReturnType<typeof parseJournalMeta>

export function parseJournalMeta(journalMeta: Element, defaultLang: string) {
  if (!journalMeta) return null;

  // journal-id
  const journalIds = Array.from(journalMeta.querySelectorAll("journal-id")).map((id) => ({
    type: id.getAttribute("journal-id-type") ?? "",
    value: id.textContent?.trim() ?? "",
  }));

  // 主标题组 - 修复：处理多个直接并列的 journal-title
  const titleGroup = journalMeta.querySelector("journal-title-group");
  const titles: { title: string; subtitle: string; lang: string }[] = [];

  if (titleGroup) {
    // 处理所有 journal-title（包括直接子元素和翻译组）
    const allJournalTitles = Array.from(titleGroup.querySelectorAll("journal-title"));
    
    for (const titleElem of allJournalTitles) {
      // 跳过空的标题
      const titleText = titleElem.textContent?.trim();
      if (!titleText) continue;
      
      titles.push({
        title: titleText,
        subtitle: "", // XML示例中没有subtitle
        lang: titleElem.getAttribute("xml:lang") ?? defaultLang,
      });
    }

    // 处理翻译标题组
    const transGroups = Array.from(titleGroup.querySelectorAll("trans-title-group"));
    for (const tg of transGroups) {
      const transTitle = tg.querySelector("trans-title")?.textContent?.trim();
      if (transTitle) {
        titles.push({
          title: transTitle,
          subtitle: tg.querySelector("trans-subtitle")?.textContent?.trim() ?? "",
          lang: tg.getAttribute("xml:lang") ?? defaultLang,
        });
      }
    }
  }

  // 缩写标题 - 修复：添加语言支持
  const abbrevTitles = Array.from(
    journalMeta.querySelectorAll("journal-title-group > abbrev-journal-title")
  ).map((node) => ({
    type: node.getAttribute("abbrev-type") ?? "",
    value: node.textContent?.trim() ?? "",
    lang: node.getAttribute("xml:lang") ?? defaultLang, // 新增语言字段
  }));

  // ISSN - 修复：支持 pub-type 和 publication-format 两种属性
  const issns = Array.from(journalMeta.querySelectorAll("issn")).map((issn) => ({
    format: issn.getAttribute("pub-type") ?? issn.getAttribute("publication-format") ?? "",
    value: issn.textContent?.trim() ?? "",
  }));

  // CN号 - 修复：从 ISSN 中提取 CN 类型，同时支持独立的 cn 节点
  let cn = journalMeta.querySelector("cn")?.textContent?.trim() ?? "";
  if (!cn) {
    // 从 ISSN 中查找 CN 类型
    const cnIssn = issns.find(issn => issn.format === 'cn');
    cn = cnIssn ? cnIssn.value : "";
  }

  // 其他字段
  const isbn = journalMeta.querySelector("isbn")?.textContent?.trim() ?? "";
  const managedBy = journalMeta.querySelector("journal-managed-by")?.textContent?.trim() ?? "";
  const sponsor = journalMeta.querySelector("journal-sponsor")?.textContent?.trim() ?? "";

  // publisher - 修复：处理多语言 publisher
  const publisherNode = journalMeta.querySelector("publisher");
  let publisher = null;

  if (publisherNode) {
    const publisherNames = Array.from(publisherNode.querySelectorAll("publisher-name"));
    const publisherLocs = Array.from(publisherNode.querySelectorAll("publisher-loc"));
    
    // 创建多语言 publisher 信息
    const publishers = publisherNames.map((nameElem, index) => ({
      name: nameElem.textContent?.trim() ?? "",
      loc: publisherLocs[index]?.textContent?.trim() ?? "",
      lang: nameElem.getAttribute("xml:lang") ?? defaultLang,
    }));

    // 默认返回第一个，或者可以根据语言筛选
    publisher = publishers.length > 0 ? publishers[0] : null;
  }

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