import { XMLUtils } from "./XMLUtils";

export interface TableCell {
  text: string;
  align?: "left" | "center" | "right" ;
  valign?: string;
  colspan?: number;
  rowspan?: number;
  style?: string;
}

export interface TableRow {
  cells: TableCell[];
}

export interface ParsedTable {
  id?: string;
  label?: string;
  caption?: string;
  header?: TableRow[];
  body?: TableRow[];
}

function parseCell(cell: Element): TableCell {
  return {
    text: cell.textContent?.trim() || "",
    align: cell.getAttribute("align") as 'left' | 'center' | 'right' || 'center',
    valign: cell.getAttribute("valign") || undefined,
    colspan: cell.hasAttribute("colspan") ? Number(cell.getAttribute("colspan")) : undefined,
    rowspan: cell.hasAttribute("rowspan") ? Number(cell.getAttribute("rowspan")) : undefined,
    style: cell.getAttribute("style") || undefined,
  };
}

function parseRow(row: Element): TableRow {
  const cellNodes = Array.from(row.children).filter(
    (n) => n.tagName.toLowerCase() === "td" || n.tagName.toLowerCase() === "th"
  );
  return { cells: cellNodes.map(parseCell) };
}

export function parseTable (tableWrap: Element) {
    const id = tableWrap.getAttribute("id") || undefined;
    const label =
      tableWrap.getElementsByTagName("label")[0]?.textContent?.trim() ||
      undefined;
    const caption =
      tableWrap.getElementsByTagName("caption")[0]?.textContent?.trim() ||
      undefined;

    const table = tableWrap.getElementsByTagName("table")[0];
    if (!table) return { id, label, caption };

    const thead = table.getElementsByTagName("thead")[0];
    const tbody = table.getElementsByTagName("tbody")[0];

    const header: TableRow[] = thead
      ? Array.from(thead.getElementsByTagName("tr")).map(parseRow)
      : [];

    const body: TableRow[] = tbody
      ? Array.from(tbody.getElementsByTagName("tr")).map(parseRow)
      : [];

    return { id, label, caption, header, body };
}

export function parseTables(doc: Element): ParsedTable[] {
  const tableWraps = XMLUtils.getChildNodes(doc, "table-wrap");

  return tableWraps.map((tableWrap) => {
    return parseTable(tableWrap);
  });
}
