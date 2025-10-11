type ReferenceParams = {
  authors: string[]; // 作者列表
  title: string; // 文献题名
  journal: string; // 刊名
  year: string; // 年份
  volume?: string; // 卷
  issue?: string; // 期
  pages?: string; // 起止页码
  lang?: string;
};

const isChineseLanguage = (lang: string) => lang === 'cn' || lang === 'zh';

export function formatGBT7714Reference(params: ReferenceParams): string {
  const { authors, title, journal, year, volume, issue, pages, lang = "zh" } = params;

  if (isChineseLanguage(lang.toLowerCase())) {
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

    return `${authorStr}. ${title}[J]. ${journal}${year ? `, ${year}` : ''}${
      volume ? `, ${volume}` : ''
    }${issue ? `(${issue})` : ''}${pages ? `:${pages}` : ''}.`;
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
