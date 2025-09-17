export interface ParsedSectionTitle {
  id: string;
  title: string;
  level?: number;
  children?: ParsedSectionTitle[];
}

/**
 * 解析 <sec> 的标题
 */
/**
 * 递归解析 <sec> 节点，提取标题及子章节
 */
export function parseSectionTitles(doc: Element, level = 1): ParsedSectionTitle[] {
  const sections = Array.from(doc.children).filter(
    (n) => n.tagName.toLowerCase() === "sec"
  );

  return sections.map((sec) => {
    const titleNode = Array.from(sec.children).find(
      (n) => n.tagName.toLowerCase() === "title"
    );
    const id = sec.getAttribute("id") || "";

    return {
      id,
      title: titleNode?.textContent?.trim() ?? "",
      level,
      children: parseSectionTitles(sec, level + 1), // 递归解析子 sec
    };
  });
}
