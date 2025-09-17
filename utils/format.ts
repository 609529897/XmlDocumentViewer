type ReferenceParams = {
  index: number; // 序号
  authors: string[]; // 作者列表
  title: string; // 文献题名
  journal: string; // 刊名
  year: number; // 年份
  volume?: string; // 卷
  issue?: string; // 期
  pages?: string; // 起止页码
  lang?: string;
};

export function formatGBT7714Reference(params: ReferenceParams): string {
  const { index, authors, title, journal, year, volume, issue, pages, lang = "zh" } = params;

  if (lang === "zh") {
    // 中文格式
    let authorStr = "";
    if (authors.length === 0) {
      authorStr = "";
    } else if (authors.length === 1) {
      authorStr = authors[0];
    } else if (authors.length > 3) {
      authorStr = authors.slice(0, 3).join(", ") + ", 等";
    } else {
      authorStr = authors.join(", ");
    }

    return `[${index}]${authorStr}. ${title}[J]. ${journal}, ${year}${
      volume ? `, ${volume}` : ""
    }${issue ? `(${issue})` : ""}${pages ? `:${pages}` : ""}.`;
  } else {
    // 英文格式
    let authorStr = "";
    if (authors.length === 0) {
      authorStr = "";
    } else if (authors.length === 1) {
      authorStr = authors[0];
    } else if (authors.length === 2) {
      authorStr = `${authors[0]} and ${authors[1]}`;
    } else if (authors.length > 3) {
      authorStr = authors.slice(0, 3).join(", ") + ", et al";
    } else {
      authorStr = authors.slice(0, -1).join(", ") + `, and ${authors[authors.length - 1]}`;
    }

    return `${authorStr ? `${authorStr}. ` : ""}${title} [J]. ${journal}${
      volume ? `, ${volume}` : ""
    }${issue ? `(${issue})` : ""}, ${year}${pages ? `: ${pages}` : ""}.`;
  }
}
