export interface ParsedAffiliation {
  id?: string;               
  label?: string;            
  lang?: string;             
  institutions?: string[];   
  org?: string;              
  address?: { lang?: string; full: string }[];  // 结构化的地址
  city?: string;             
  state?: string;            
  postalCode?: string;       
  country?: string;          
  rawText?: string;          
}

export function parseAffiliations(doc: Element, defaultLang: string): ParsedAffiliation[] {
  const results: ParsedAffiliation[] = [];

  // 处理 <aff-alternatives>
  doc.querySelectorAll("aff-alternatives").forEach(alt => {
    alt.querySelectorAll("aff").forEach(aff => {
      results.push(parseAffNode(aff, defaultLang, alt.getAttribute("id") || undefined));
    });
  });

  // 处理单独的 <aff>
  doc.querySelectorAll("aff").forEach(aff => {
    if (aff.parentElement?.tagName === "aff-alternatives") return;
    results.push(parseAffNode(aff, defaultLang, aff.getAttribute("id") || undefined));
  });

  return results;
}

function parseAffNode(aff: Element, defaultLang: string, parentId?: string): ParsedAffiliation {
  const label = aff.querySelector("label")?.textContent?.trim();
  const lang = aff.getAttribute("xml:lang") || defaultLang;

  // institutions (支持 institution-wrap)
  const institutions: string[] = [];
  aff.querySelectorAll("institution, institution-wrap institution").forEach(el => {
    const txt = el.textContent?.trim();
    if (txt) institutions.push(txt);
  });

  // org
  const org = aff.querySelector("org")?.textContent?.trim();

  // 地址处理
  let city: string | undefined;
  let state: string | undefined;
  let postalCode: string | undefined;
  const address: { lang?: string; full: string }[] = [];

  aff.querySelectorAll("addr-line").forEach(el => {
    const txt = el.textContent?.trim();
    if (!txt) return;

    const type = el.getAttribute("content-type");
    const langAttr = el.getAttribute("xml:lang") || lang;

    if (type === "city") {
      city = txt;
    } else if (type === "state") {
      state = txt;
    } else if (type === "postcode" || type === "postal-code") {
      postalCode = txt;
    } else {
      // 没有 content-type → 当作完整地址
      address.push({ lang: langAttr, full: txt });
    }
  });

  // 兼容 <city>/<state>/<postal-code>
  city = city || aff.querySelector("city")?.textContent?.trim() || undefined;
  state = state || aff.querySelector("state")?.textContent?.trim() || undefined;
  postalCode = postalCode || aff.querySelector("postal-code")?.textContent?.trim() || undefined;

  // 国家
  const country = aff.querySelector("country")?.textContent?.trim() || undefined;

  // fallback text
  const rawText =
    aff.childNodes.length === 1 && aff.childNodes[0].nodeType === Node.TEXT_NODE
      ? aff.textContent?.trim()
      : undefined;

  return {
    id: parentId || aff.getAttribute("id") || undefined,
    label,
    lang,
    institutions: institutions.length ? institutions : [],
    org,
    address: address.length ? address : [],
    city,
    state,
    postalCode,
    country,
    rawText,
  };
}
