export class XMLUtils {
  // 获取指定标签的所有子节点
  static getChildNodes(parent: Element, tagName: string): Element[] {
    return Array.from(parent.getElementsByTagName(tagName));
  }

  // 辅助函数：安全获取DOM元素
  static getFirstElement = (
    parent: Element | Document,
    tagName: string
  ): Element | null => {
    const elements = parent.getElementsByTagName(tagName);
    return elements.length > 0 ? elements[0] : null;
  };

  // 获取文档中除指定元素外的所有语言标签
  static getOtherLanguages(xmlDoc: Document, mainLang: string): string[] {
    const langSet = new Set<string>();

    // 遍历所有元素
    const allElements = xmlDoc.getElementsByTagName("*");
    for (let i = 0; i < allElements.length; i++) {
      const el = allElements[i];
      const lang = el.getAttribute("xml:lang");

      if (lang && lang !== mainLang) {
        langSet.add(lang);
      }
    }

    // 转成数组
    const otherLanguages = Array.from(langSet);
    return otherLanguages;
  }
}
