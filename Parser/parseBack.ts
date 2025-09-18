export type ParsedBack = ReturnType<typeof parseBack>;

export interface References {
  id: string;
  label: string;
  publicationType: string;
  authors: Author[];
  articleTitle: string;
  source: string;
  year: string;
  volume: string;
  issue: string;
  pages: string;
  doi: string;
  publisherName: string;
  publisherLoc: string;
}

interface Author {
  surname: string;
  givenNames: string;
  fullName: string;
}

function parseAuthors(citationElement: Element): Author[] {
  const authors: Author[] = [];
  const personGroup = citationElement.querySelector('person-group[person-group-type="author"]');
  
  if (!personGroup) return authors;
  
  const nameElements = personGroup.querySelectorAll('name');
  nameElements.forEach(nameElement => {
    const surname = nameElement.querySelector('surname')?.textContent?.trim() || '';
    const givenNames = nameElement.querySelector('given-names')?.textContent?.trim() || '';
    const fullName = [givenNames, surname].filter(Boolean).join(" ")
    
    if (surname) {
      authors.push({ surname, givenNames, fullName });
    }
  });
  
  return authors;
}

function getPages(citationElement: Element): string {
  const fpage = citationElement.querySelector('fpage')?.textContent?.trim();
  const lpage = citationElement.querySelector('lpage')?.textContent?.trim();
  
  if (fpage && lpage) {
    return `${fpage}-${lpage}`;
  }
  return fpage || lpage || '';
}

export function parseBack(back: Element) {
  if (!back) return null;

  // 1. app-group (附录 / 补充材料)
  const apps = Array.from(back.querySelectorAll("app-group > app")).map((app) => ({
    id: app.getAttribute("id") ?? "",
    title: app.querySelector("title")?.textContent?.trim() ?? "",
    text: app.querySelector("p")?.textContent?.trim() ?? "",
    uri: app.querySelector("uri")?.textContent?.trim() ?? "",
    xrefs: Array.from(app.querySelectorAll("xref")).map((x) => ({
      refType: x.getAttribute("ref-type") ?? "",
      rid: x.getAttribute("rid") ?? "",
      text: x.textContent ?? "",
    })),
    supplementary: {
      id: app.querySelector("supplementary-material")?.getAttribute("id") ?? "",
      href: app.querySelector("supplementary-material")?.getAttribute("xlink:href") ?? "",
    },
  }));

  // 2. notes (作者贡献、IRB、同意声明、数据声明、COI 等)
  const notes = Array.from(back.querySelectorAll("notes")).map((n) => ({
    type: n.getAttribute("notes-type") ?? "general",
    title: n.querySelector("title")?.textContent?.trim() ?? "",
    text: n.querySelector("p")?.textContent?.trim() ?? "",
  }));

  // 3. ack (致谢)
  const acknowledgments = Array.from(back.querySelectorAll("ack")).map((ack) => ({
    title: ack.querySelector("title")?.textContent?.trim() ?? "Acknowledgments",
    text: ack.querySelector("p")?.textContent?.trim() ?? "",
  }));

  // 4. ref-list (参考文献列表)
  const references: References[] = Array.from(
    back.querySelectorAll("ref-list ref")
  ).map((ref) => {
    const citation = ref.querySelector("element-citation") || ref.querySelector("mixed-citation");

    if (!citation) return null;

    const id = ref.getAttribute("id") || "";
    const label = ref.querySelector("label")?.textContent?.trim() || "";
    const publicationType = citation.getAttribute("publication-type") || "";
    const authors = parseAuthors(citation).filter(Boolean);

    return {
      id,
      label,
      publicationType,
      authors,
      articleTitle: citation.querySelector("article-title")?.textContent?.trim() ?? "",
      source: citation.querySelector("source")?.textContent?.trim() ?? "",
      year: citation.querySelector("year")?.textContent ?? "",
      volume: citation.querySelector("volume")?.textContent ?? "",
      issue: citation.querySelector("issue")?.textContent?.trim() ?? "",
      pages: getPages(citation),
      doi: citation.querySelector('pub-id[pub-id-type="doi"]')?.textContent ?? "",
      publisherName: citation.querySelector("publisher-name")?.textContent?.trim() ?? "",
      publisherLoc: citation.querySelector("publisher-loc")?.textContent?.trim() ?? "",
    };
  }).filter((ref): ref is NonNullable<typeof ref> => ref !== null);


  // 5. fn-group (出版者声明等脚注)
  const fnGroup = Array.from(back.querySelectorAll("fn-group > fn")).map((fn) => ({
    text: fn.textContent?.trim() ?? "",
  }));

  return {
    apps,
    notes,
    acknowledgments: acknowledgments || [],
    references,
    fnGroup,
  };
}
