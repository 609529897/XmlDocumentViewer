interface Graphic {
  specificUse: string;
  href: string;
  width?: number;
  height?: number;
}

interface Fig {
  id: string;
  doi?: string;
  graphics: Graphic[];
}

interface FigGroup {
  id: string;
  label?: string;
  title?: string;
  figs: Fig[];
  groupGraphics: Graphic[];
}

// 辅助函数：解析 <graphic>
function parseGraphic(g: Element): Graphic {
  const href = g.getAttribute("xlink:href") || "";
  const specificUse = g.getAttribute("specific-use") || "";

  let width: number | undefined;
  let height: number | undefined;

  // 遍历子节点，查找 fx-imagestate
  Array.from(g.childNodes).forEach((node) => {
    if (node.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
      const content = (node as ProcessingInstruction).data;
      const widthMatch = content.match(/width="([\d.]+)"/);
      const heightMatch = content.match(/height="([\d.]+)"/);
      if (widthMatch) width = parseFloat(widthMatch[1]);
      if (heightMatch) height = parseFloat(heightMatch[1]);
    }
  });

  return { href, specificUse, width, height };
}

// 主解析函数
export function parseFigGroup(doc: Element): FigGroup | null {
  if (!doc) return null;

  const id = doc.getAttribute("id") || "";

  // caption 部分
  const label = doc.querySelector("abstract > label")?.textContent?.trim() || undefined;
  const title = doc.querySelector("abstract > title")?.textContent?.trim() || undefined;

  // 提取 <fig>
  const figs: Fig[] = Array.from(doc.querySelectorAll(":scope > fig")).map((figEl) => {
    const figId = figEl.getAttribute("id") || "";
    const doi = figEl.querySelector("object-id[pub-id-type=doi]")?.textContent?.trim() || undefined;

    const graphics: Graphic[] = Array.from(figEl.querySelectorAll("alternatives > graphic")).map((g) =>
      parseGraphic(g)
    );

    return { id: figId, doi, graphics };
  });

  // 提取 fig-group 级别的 alternatives
  const groupGraphics: Graphic[] = Array.from(doc.querySelectorAll(":scope > alternatives > graphic")).map((g) =>
    parseGraphic(g)
  );

  return { id, label, title, figs, groupGraphics };
}
