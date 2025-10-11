import { XMLUtils } from "./XMLUtils";

// 作者引用映射接口
export type AuthorXrefItem = {
  rid: string; // 引用ID
  content: string; // 引用内容
}

type AuthorXrefMap = {
  aff?: AuthorXrefItem[]; // affiliations
  fn?: AuthorXrefItem[]; // footnotes
  corresp?: AuthorXrefItem[]; // corresponding marks
  [key: string]: AuthorXrefItem[] | undefined;
};

export interface Author {
  stid?: string;
  surname?: string;
  givenNames?: string;
  fullName?: string; // 最终显示的姓名
  nameLangMap?: Record<string, string>;
  roles?: string[];
  xrefs?: AuthorXrefMap;
  email?: string[];
  address?: string;
  bio?: string;
  degrees?: string;
  prefix?: string;
  isCorresponding?: boolean;
  lang?: string;
}

const getFullName = (givenNames?: string, surname?: string, lang?: string) => {
  if (!givenNames && !surname) return undefined;
  return lang === "zh" || lang === "cn"
    ? [surname, givenNames].filter(Boolean).join("")
    : [givenNames, surname].filter(Boolean).join(" ");
};

export function parseAuthors(doc: Element, defaultLang: string): Author[] {
  const contribNodes = XMLUtils.getChildNodes(doc, "contrib");
  // .filter((c) => c.getAttribute("contrib-type") === "author");

  return contribNodes.map((c) => {
    const idNode = c.querySelector("contrib-id[contrib-id-type='stid']");
    const stid = idNode?.textContent?.trim() || undefined;

    const surname = c.getElementsByTagName("surname")[0]?.textContent?.trim();
    const givenNames = c
      .getElementsByTagName("given-names")[0]
      ?.textContent?.trim();

    // 默认姓名
    let fullName = getFullName(givenNames, surname, defaultLang);

    // 多语言姓名映射
    const nameLangMap: Record<string, string> = {};

    // 处理 <name-alternatives>
    const nameAltNodes = Array.from(
      c.getElementsByTagName("name-alternatives")
    );
    nameAltNodes.forEach((alt) => {
      Array.from(alt.children).forEach((child) => {
        const childLang = child.getAttribute("xml:lang") || defaultLang; // 默认中文
        if (child.tagName === "name") {
          const altSurname = child
            .getElementsByTagName("surname")[0]
            ?.textContent?.trim();
          const altGiven = child
            .getElementsByTagName("given-names")[0]
            ?.textContent?.trim();
          nameLangMap[childLang] =
            getFullName(altGiven, altSurname, childLang) || "";
        } else if (child.tagName === "string-name") {
          nameLangMap[childLang] = child.textContent?.trim() || "";
        }
      });
    });

    // 单独处理 <string-name>
    const stringNameNodes = Array.from(c.getElementsByTagName("string-name"));
    stringNameNodes.forEach((node) => {
      const nodeLang = node.getAttribute("xml:lang") || defaultLang;
      nameLangMap[nodeLang] = node.textContent?.trim() || "";
    });

    // 如果没有 <surname>/<given-names>，fallback 到 string-name
    if (!fullName) {
      fullName =
        nameLangMap[defaultLang || "zh"] || Object.values(nameLangMap)[0];
    }

    // 根据 lang 选择显示名
    let displayName = fullName;
    if (defaultLang && nameLangMap[defaultLang]) {
      displayName = nameLangMap[defaultLang];
    }

    // 角色
    const roles = Array.from(c.getElementsByTagName("role"))
      .map((r) => r.textContent?.trim())
      .filter(Boolean) as string[];

    // xref
    const xrefs: AuthorXrefMap = {};
    const xrefNodes = Array.from(c.getElementsByTagName("xref"));
    xrefNodes.forEach((xref) => {
      const refType = xref.getAttribute("ref-type") || "other";
      const rid = xref.getAttribute("rid") || "";
      if (!xrefs[refType]) xrefs[refType] = [];
      (xrefs[refType] || []).push({
        rid,
        content: xref?.textContent?.trim() || "",
      });
    });

    // lang
    const nodeLang =
      c.getAttribute("xml:lang") ||
      c.querySelector("name, string-name")?.getAttribute("xml:lang") ||
      defaultLang;

    // email (包括 <bio> 里的)
    const emails = [
      ...Array.from(c.getElementsByTagName("email")),
      ...Array.from(c.getElementsByTagName("bio")).flatMap((bio) =>
        Array.from(bio.getElementsByTagName("email"))
      ),
    ]
      .map((e) => e.textContent?.trim())
      .filter((e): e is string => e !== "");

    // 是否通讯作者
    const isCorresponding =
      c.getAttribute("corresp") === "yes" || (xrefs.corresp?.length ?? 0) > 0;

    return {
      stid,
      surname,
      givenNames,
      fullName: displayName,
      nameLangMap,
      roles,
      xrefs,
      email: emails,
      address: c.getElementsByTagName("address")[0]?.textContent?.trim(),
      bio: c.getElementsByTagName("bio")[0]?.textContent?.trim(),
      degrees: c.getElementsByTagName("degrees")[0]?.textContent?.trim(),
      prefix: c.getElementsByTagName("prefix")[0]?.textContent?.trim(),
      isCorresponding,
      lang: nodeLang,
    };
  });
}
