export interface ParsedAbstract {
  type: string;
  lang?: string;
  paragraphs: string[];
  xrefs: XRef[];
  graphics?: {
    id?: string;
    href: string;
    use?: string;
  }[];
  media?: {
    id?: string;
    label?: string;
    caption?: string;
    href?: string;
    mimetype?: string;
    mimeSubtype?: string;
  }[];
}

export interface XRef {
  refType: string;
  rid: string;
  text: string;
}

export function parseAbstracts(doc: Element, defaultLang: string): ParsedAbstract[] {
  const abstracts = Array.from(doc.querySelectorAll("abstract, trans-abstract"));

  return abstracts.map((abs) => {
    const type =
      abs.tagName === "abstract"
        ? abs.getAttribute("abstract-type") || ""
        : "trans-abstract";

    const lang = abs.getAttribute("xml:lang") || defaultLang;

    let paragraphs: string[] = [];

    // 先尝试 <sec>
    const secs = Array.from(abs.querySelectorAll(":scope > sec"));
    if (secs.length > 0) {
      paragraphs = secs.map((sec) => {
        const title = sec.querySelector("title")?.textContent?.trim();
        const ps = Array.from(sec.querySelectorAll("p"))
          .map((p) => p.textContent?.trim() || "")
          .filter(Boolean);
        if (title) {
          return [title, ...ps].filter(Boolean).join(" ");
        }
        return ps.join("\n");
      });
    } else {
      // 普通 <p>
      paragraphs = Array.from(abs.querySelectorAll(":scope > p"))
        .map((p) => p.textContent?.trim() || "")
        .filter(Boolean);
    }

    // 提取 <xref>
    const xrefs: XRef[] = Array.from(abs.querySelectorAll("xref")).map((x) => ({
      refType: x.getAttribute("ref-type") || "",
      rid: x.getAttribute("rid") || "",
      text: x.textContent?.trim() || "",
    }));

    // 提取 <media>
    const media = Array.from(abs.querySelectorAll("media")).map((m) => ({
      id: m.getAttribute("id") || undefined,
      label: m.querySelector("label")?.textContent?.trim() || undefined,
      caption: m.querySelector("caption p")?.textContent?.trim() || undefined,
      href:
        m.getAttribute("xlink:href") ||
        m.querySelector("ext-link")?.getAttribute("xlink:href") ||
        undefined,
      mimetype: m.getAttribute("mimetype") || undefined,
      mimeSubtype: m.getAttribute("mime-subtype") || undefined,
    }));

    // 提取 <graphic>
    const graphics = Array.from(abs.querySelectorAll("graphic")).map((g) => ({
      id: g.getAttribute("id") || undefined,
      href: g.getAttribute("xlink:href") || "",
      use: g.getAttribute("specific-use") || undefined,
    }));

    return {
      type,
      lang,
      paragraphs,
      xrefs,
      graphics: graphics.length > 0 ? graphics : [],
      media: media.length > 0 ? media : [],
    };
  });
}
