// types
export interface XRef {
  refType: string;
  rid: string;
  text: string;
}

export interface ParsedGraphic {
  id?: string;
  href: string;
  use?: string;
  width?: number;
  height?: number;
}

export interface ParsedFigure {
  type: "fig" | "fig-group";
  id: string;
  label?: string;
  caption?: string;
  graphics: ParsedGraphic[];    // graphics on this node (fig or fig-group)
  inlineGraphics: string[];    // inline-graphic hrefs
  xrefs: XRef[];
  children?: ParsedFigure[];   // only for fig-group (could be empty)
}

// helper: parse <graphic> and its <?fx-imagestate ...?>
function parseGraphic(g: Element): ParsedGraphic {
  const parsed: ParsedGraphic = {
    id: g.getAttribute("id") || undefined,
    href: g.getAttribute("xlink:href") || g.getAttribute("href") || "",
    use: g.getAttribute("specific-use") || undefined,
  };

  // ProcessingInstruction nodeType is 7; some environments also expose Node.PROCESSING_INSTRUCTION_NODE
  Array.from(g.childNodes).forEach((node) => {
    const nodeType = (node as any).nodeType;
    if (nodeType === (Node as any).PROCESSING_INSTRUCTION_NODE || nodeType === 7) {
      const data = (node as any).data || "";
      const w = data.match(/width="([\d.]+)"/);
      const h = data.match(/height="([\d.]+)"/);
      if (w) parsed.width = parseFloat(w[1]);
      if (h) parsed.height = parseFloat(h[1]);
    }
  });

  return parsed;
}

// parse a single <fig>
export function parseFigure(fig: Element): ParsedFigure {
  const id = fig.getAttribute("id") || "";

  // label: try direct label or abstract[abstract-type="caption"] > label
  const label =
    (fig.querySelector("label")?.textContent?.trim()) ||
    (fig.querySelector('abstract[abstract-type="caption"] > label')?.textContent?.trim()) ||
    undefined;

  // caption: prefer <caption> p*, otherwise abstract[abstract-type="caption"] title/p
  let caption: string | undefined;
  const capNode = fig.querySelector("caption");
  if (capNode) {
    const ps = Array.from(capNode.querySelectorAll("p"))
      .map((p) => p.textContent?.trim() || "")
      .filter(Boolean);
    caption = ps.join(" ");
  } else {
    const abs = fig.querySelector('abstract[abstract-type="caption"]');
    if (abs) {
      const title = abs.querySelector("title")?.textContent?.trim() || "";
      const ps = Array.from(abs.querySelectorAll("p"))
        .map((p) => p.textContent?.trim() || "")
        .filter(Boolean);
      caption = [title, ...ps].filter(Boolean).join(" ").trim() || undefined;
    }
  }

  // all graphics under this fig (includes <alternatives> children)
  const graphics = Array.from(fig.getElementsByTagName("graphic")).map((g) => parseGraphic(g));

  // inline-graphic hrefs
  const inlineGraphics = Array.from(fig.getElementsByTagName("inline-graphic"))
    .map((ig) => ig.getAttribute("xlink:href") || ig.getAttribute("href") || "")
    .filter(Boolean);

  // xrefs
  const xrefs: XRef[] = Array.from(fig.getElementsByTagName("xref")).map((x) => ({
    refType: x.getAttribute("ref-type") || "",
    rid: x.getAttribute("rid") || "",
    text: x.textContent?.trim() || "",
  }));

  return {
    type: "fig",
    id,
    label,
    caption,
    graphics,
    inlineGraphics,
    xrefs,
  };
}

// parse <fig-group> (recursive: will parse direct child <fig> / <fig-group> into children)
export function parseFigGroup(group: Element): ParsedFigure {
  const id = group.getAttribute("id") || "";

  // find abstract caption if present among direct children
  let label: string | undefined;
  let caption: string | undefined;
  for (const child of Array.from(group.children)) {
    const ln = (child.localName || child.tagName).toLowerCase();
    if (ln === "abstract" && child.getAttribute("abstract-type") === "caption") {
      label = child.querySelector("label")?.textContent?.trim() || undefined;
      caption = child.querySelector("title")?.textContent?.trim() || undefined;
      // if there are <p> inside, append them
      const ps = Array.from(child.querySelectorAll("p")).map((p) => p.textContent?.trim() || "").filter(Boolean);
      if (ps.length) caption = [caption || "", ...ps].filter(Boolean).join(" ").trim();
      break;
    }
  }

  // group-level graphics: alternatives that are direct children of the group
  const groupGraphics: ParsedGraphic[] = [];
  for (const child of Array.from(group.children)) {
    const ln = (child.localName || child.tagName).toLowerCase();
    if (ln === "alternatives") {
      for (const g of Array.from(child.getElementsByTagName("graphic"))) {
        groupGraphics.push(parseGraphic(g));
      }
    }
  }

  // children: direct child <fig> or nested <fig-group> (preserve order)
  const children: ParsedFigure[] = [];
  for (const child of Array.from(group.children)) {
    const ln = (child.localName || child.tagName).toLowerCase();
    if (ln === "fig") {
      children.push(parseFigure(child));
    } else if (ln === "fig-group") {
      children.push(parseFigGroup(child)); // recursion
    }
  }

  return {
    type: "fig-group",
    id,
    label,
    caption,
    graphics: groupGraphics,
    inlineGraphics: [],
    xrefs: [],
    children,
  };
}

// 主入口：按文档出现顺序深度优先地遍历 root（root 可以是 document.documentElement 或 某个 <sec>），
// 遇到 <fig> 或 <fig-group> 就产出一个条目（遇到 fig-group 时不会再递归进入它的子树，
// 因为 parseFigGroup 已经把子 fig/fig-group 放到 children 中）
export function parseFigures(root: Element): ParsedFigure[] {
  const results: ParsedFigure[] = [];

  function walk(node: Element) {
    // iterate element children in order
    for (let el = node.firstElementChild as Element | null; el; el = el.nextElementSibling as Element | null) {
      const name = (el.localName || el.tagName).toLowerCase();
      if (name === "fig") {
        results.push(parseFigure(el));
        // do NOT recurse into this fig (we already parsed it)
      } else if (name === "fig-group") {
        results.push(parseFigGroup(el));
        // do NOT recurse into fig-group (children already included inside parseFigGroup)
      } else {
        // regular element -> continue walk
        walk(el);
      }
    }
  }

  walk(root);
  return results;
}
