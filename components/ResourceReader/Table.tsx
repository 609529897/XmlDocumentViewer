import React, { forwardRef } from "react";

export interface TableCell {
  text?: string;
  colspan?: number;
  rowspan?: number;
  align?: "left" | "center" | "right";
  valign?: "top" | "middle" | "bottom";
}

export interface TableRow {
  cells: TableCell[];
}

export interface TableItem {
  header?: TableRow[];
  body?: TableRow[];
}

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  item: TableItem;
  className?: string;
}

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ item, className, ...props }, ref) => {
    return (
      <table
        ref={ref}
        className={`border-collapse text-xl ${className ?? ""}`}
        {...props}
      >
        <thead className="bg-gray-100">
          {item.header?.map((row, rowIndex) => (
            <tr key={`h-${rowIndex}`}>
              {row.cells.map((cell, cellIndex) => (
                <th
                  key={`h-${rowIndex}-${cellIndex}`}
                  colSpan={cell.colspan}
                  rowSpan={cell.rowspan}
                  className="border border-gray-300 px-8 py-4 font-medium text-gray-700 whitespace-pre-wrap"
                  style={{
                    textAlign: cell.align ?? "center",
                    verticalAlign: cell.valign ?? "middle",
                  }}
                >
                  {cell.text}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {item.body?.map((row, rowIndex) => (
            <tr
              key={`b-${rowIndex}`}
              className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              {row.cells.map((cell, cellIndex) => (
                <td
                  key={`b-${rowIndex}-${cellIndex}`}
                  colSpan={cell.colspan}
                  rowSpan={cell.rowspan}
                  className="border border-gray-300 px-8 py-4 text-gray-800 whitespace-pre-wrap"
                  style={{
                    textAlign: cell.align ?? "center",
                    verticalAlign: cell.valign ?? "middle",
                  }}
                >
                  {cell.text ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
);

Table.displayName = "Table";

export default Table;
export { Table };
