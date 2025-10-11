export type ParsedArticleMeta = ReturnType<typeof parseArticleMeta>;

export type Title = {
  title: string;
  subtitle: string;
  lang: string;
};

export type KeywordGroup = {
  type: string;
  lang: string;
  title: string;
  keywords: string[];
};

export type Date = {
  type: string;
  year: string;
  month: string;
  day: string;
};

export type PubDate = {
  string: string;
} & Date;

export function parseArticleMeta(articleMeta: Element, defaultLang: string) {
  if (!articleMeta) return null;

  // 1. article-id
  const articleIds = Array.from(articleMeta.querySelectorAll("article-id")).map(
    (id) => ({
      type: id.getAttribute("pub-id-type") ?? "",
      value: id.textContent?.trim() ?? "",
    })
  );

  // 2. 分类
  const categories = Array.from(
    articleMeta.querySelectorAll("article-categories > subj-group")
  ).map((sg) => ({
    type: sg.getAttribute("subj-group-type") ?? "",
    lang: sg.getAttribute("xml:lang") ?? defaultLang,
    subjects: Array.from(sg.querySelectorAll("subject")).map(
      (s) => s.textContent?.trim() ?? ""
    ),
  }));

  const seriesTitles = Array.from(
    articleMeta.querySelectorAll("article-categories > series-title")
  ).map((s) => ({
    lang: s.getAttribute("xml:lang") ?? defaultLang,
    value: s.textContent?.trim() ?? "",
  }));
  const seriesTexts = Array.from(
    articleMeta.querySelectorAll("article-categories > series-text")
  ).map((s) => ({
    lang: s.getAttribute("xml:lang") ?? defaultLang,
    value: s.textContent?.trim() ?? "",
  }));

  // 3. 标题组
  const titleGroup = articleMeta.querySelector("title-group");
  const titles: Title[] = [];
  if (titleGroup) {
    const mainTitle = titleGroup.querySelector("article-title");
    const mainSubtitle = titleGroup.querySelector("subtitle");
    titles.push({
      title: mainTitle?.innerHTML?.trim() ?? "",
      subtitle: mainSubtitle?.innerHTML?.trim() ?? "",
      lang: defaultLang,
    });

    for (const tg of Array.from(
      titleGroup.querySelectorAll("trans-title-group")
    )) {
      const transTitle = tg.querySelector("trans-title");
      const transSubtitle = tg.querySelector("trans-subtitle");
      titles.push({
        title: transTitle?.innerHTML?.trim() ?? "",
        subtitle: transSubtitle?.innerHTML?.trim() ?? "",
        lang: tg.getAttribute("xml:lang") ?? "",
      });
    }
  }

  // 4. 作者与编辑
  const contribGroups = Array.from(
    articleMeta.querySelectorAll("contrib-group")
  ).map((cg) => {
    const contribs = Array.from(cg.querySelectorAll("contrib")).map((c) => ({
      type: c.getAttribute("contrib-type") ?? "",
      specificUse: c.getAttribute("specific-use") ?? "",
      corresp: c.getAttribute("corresp") === "yes",
      orcid:
        c
          .querySelector("contrib-id[contrib-id-type='orcid']")
          ?.textContent?.trim() ?? "",
      stid:
        c
          .querySelector("contrib-id[contrib-id-type='stid']")
          ?.textContent?.trim() ?? "",
      name: {
        prefix: c.querySelector("name > prefix")?.textContent?.trim() ?? "",
        surname: c.querySelector("name > surname")?.textContent?.trim() ?? "",
        given: c.querySelector("name > given-names")?.textContent?.trim() ?? "",
      },
      nameAlternatives: Array.from(
        c.querySelectorAll("name-alternatives > name")
      ).map((n) => ({
        lang: n.getAttribute("xml:lang") ?? "",
        surname: n.querySelector("surname")?.textContent?.trim() ?? "",
        given: n.querySelector("given-names")?.textContent?.trim() ?? "",
      })),
      stringNames: Array.from(c.querySelectorAll("string-name")).map((sn) => ({
        lang: sn.getAttribute("xml:lang") ?? "",
        value: sn.textContent?.trim() ?? "",
      })),
      roles: Array.from(c.querySelectorAll("role")).map(
        (r) => r.textContent?.trim() ?? ""
      ),
      xrefs: Array.from(c.querySelectorAll("xref")).map((x) => ({
        rid: x.getAttribute("rid") ?? "",
        refType: x.getAttribute("ref-type") ?? "",
        value: x.textContent?.trim() ?? "",
      })),
      degrees: c.querySelector("degrees")?.textContent?.trim() ?? "",
      bio: c.querySelector("bio")?.textContent?.trim() ?? "",
      address: c.querySelector("address")?.textContent?.trim() ?? "",
      email: c.querySelector("email")?.textContent?.trim() ?? "",
    }));
    return contribs;
  });

  // 5. 机构信息
  const affs = Array.from(articleMeta.querySelectorAll("aff")).map((a) => ({
    id: a.getAttribute("id") ?? "",
    lang: a.getAttribute("xml:lang") ?? defaultLang,
    label: a.querySelector("label")?.textContent?.trim() ?? "",
    text: a.textContent?.trim() ?? "",
  }));
  const affAlternatives = Array.from(
    articleMeta.querySelectorAll("aff-alternatives")
  ).map((aa) => ({
    id: aa.getAttribute("id") ?? "",
    affs: Array.from(aa.querySelectorAll("aff")).map((a) => ({
      lang: a.getAttribute("xml:lang") ?? defaultLang,
      text: a.textContent?.trim() ?? "",
    })),
  }));

  // 6. 通讯作者 / 作者备注
  const correspNotes = Array.from(
    articleMeta.querySelectorAll("author-notes corresp")
  ).map((c) => ({
    id: c.getAttribute("id") ?? "",
    label: c.querySelector("label")?.textContent?.trim() ?? "",
    email: c.querySelector("email")?.textContent?.trim() ?? "",
    text: c.textContent?.trim() ?? "",
  }));
  const footnotes = Array.from(
    articleMeta.querySelectorAll("author-notes fn")
  ).map((fn) => ({
    id: fn.getAttribute("id") ?? "",
    type: fn.getAttribute("fn-type") ?? "",
    text: fn.textContent?.trim() ?? "",
  }));

  // 7. 出版日期
  const pubDates: PubDate[] = Array.from(
    articleMeta.querySelectorAll("pub-date")
  ).map((pd) => ({
    type: pd.getAttribute("pub-type") ?? "",
    string: pd.querySelector("string-date")?.textContent?.trim() ?? "",
    year: pd.querySelector("year")?.textContent?.trim() ?? "",
    month: pd.querySelector("month")?.textContent?.trim() ?? "",
    day: pd.querySelector("day")?.textContent?.trim() ?? "",
  }));

  // 8. 卷期页码
  const volume = articleMeta.querySelector("volume")?.textContent?.trim() ?? "";
  const issue = articleMeta.querySelector("issue")?.textContent?.trim() ?? "";
  const year = articleMeta.querySelector("year")?.textContent?.trim() ?? "";
  const supplement =
    articleMeta.querySelector("supplement")?.textContent?.trim() ?? "";
  const fpage = articleMeta.querySelector("fpage")?.textContent?.trim() ?? "";
  const lpage = articleMeta.querySelector("lpage")?.textContent?.trim() ?? "";
  const pageRange =
    articleMeta.querySelector("page-range")?.textContent?.trim() ?? "";

  // 9. 历史记录
  const history = Array.from(
    articleMeta.querySelectorAll("history > date")
  ).map((d) => ({
    type: d.getAttribute("date-type") ?? "",
    year: d.querySelector("year")?.textContent?.trim() ?? "",
    month: d.querySelector("month")?.textContent?.trim() ?? "",
    day: d.querySelector("day")?.textContent?.trim() ?? "",
  }));

  // 10. 权限
  const permissions = {
    copyrightStatement:
      articleMeta
        .querySelector("permissions > copyright-statement")
        ?.textContent?.trim() ?? "",
    copyrightYear:
      articleMeta
        .querySelector("permissions > copyright-year")
        ?.textContent?.trim() ?? "",
    copyrightHolder:
      articleMeta
        .querySelector("permissions > copyright-holder")
        ?.textContent?.trim() ?? "",
    freeToRead:
      articleMeta
        .querySelector("permissions > ali\\:free_to_read")
        ?.textContent?.trim() ?? "",
    license: {
      type:
        articleMeta
          .querySelector("permissions > license")
          ?.getAttribute("license-type") ?? "",
      text:
        articleMeta
          .querySelector("permissions > license > license-p")
          ?.textContent?.trim() ?? "",
      url:
        articleMeta
          .querySelector("permissions > license > license-p > self-uri")
          ?.getAttribute("xlink:href") ?? "",
    },
  };

  // 11. 摘要
  // const abstracts = Array.from(articleMeta.querySelectorAll("abstract")).map((a) => ({
  //   type: a.getAttribute("abstract-type") ?? "author",
  //   text: a.textContent?.trim() ?? "",
  //   lang: a.getAttribute("xml:lang") ?? defaultLang
  // }));
  // const transAbstracts = Array.from(articleMeta.querySelectorAll("trans-abstract")).map((a) => ({
  //   lang: a.getAttribute("xml:lang") ?? "",
  //   text: a.textContent?.trim() ?? "",
  // }));

  // 12. 关键词
  const keywords: KeywordGroup[] = Array.from(
    articleMeta.querySelectorAll("kwd-group")
  ).map((kg) => ({
    type: kg.getAttribute("kwd-group-type") ?? "",
    lang: kg.getAttribute("xml:lang") ?? defaultLang,
    title: kg.querySelector("title")?.textContent?.trim() ?? "",
    keywords: Array.from(kg.querySelectorAll("kwd")).map(
      (k) => k.textContent?.trim() ?? ""
    ),
  }));

  // 13. 基金
  const fundingGroups = Array.from(
    articleMeta.querySelectorAll("funding-group")
  )
    .map((fg) => {
      const lang = fg.getAttribute("xml:lang") ?? defaultLang;

      return Array.from(fg.querySelectorAll("award-group")).map((ag) => ({
        // 基金来源信息
        sources: Array.from(ag.querySelectorAll("funding-source")).map(
          (fs) => ({
            lang: lang,
            value: (fs.textContent || "").trim(),
          })
        ),

        // 项目编号
        awardIds: Array.from(ag.querySelectorAll("award-id"))
          .map((a) => (a.textContent || "").trim())
          .filter((id) => id), // 过滤空值

        // 主要承担单位
        principalRecipients: Array.from(
          ag.querySelectorAll("principal-award-recipient")
        )
          .map((p) => (p.textContent || "").trim())
          .filter((recipient) => recipient),

        // 项目描述
        awardDesc: (ag.querySelector("award-desc")?.textContent || "").trim(),

        // 可选：添加语言信息
        lang: lang,
      }));
    })
    .flat();
  const fundingStatement =
    articleMeta.querySelector("funding-statement")?.textContent?.trim() ?? "";

  // 14. 计数
  const counts = {
    pages:
      articleMeta.querySelector("counts > page-count")?.textContent?.trim() ??
      "",
    refs:
      articleMeta.querySelector("counts > ref-count")?.textContent?.trim() ??
      "",
    tables:
      articleMeta.querySelector("counts > table-count")?.textContent?.trim() ??
      "",
    figs:
      articleMeta.querySelector("counts > fig-count")?.textContent?.trim() ??
      "",
  };

  return {
    articleIds,
    categories,
    seriesTitles,
    seriesTexts,
    titles,
    contribGroups,
    affs,
    affAlternatives,
    correspNotes,
    footnotes,
    pubDates,
    volume,
    issue,
    year,
    supplement,
    fpage,
    lpage,
    pageRange,
    history,
    permissions,
    // abstracts,
    // transAbstracts,
    keywords,
    fundingGroups,
    fundingStatement,
    counts,
  };
}
