import { SvgIcon } from "@/components/SvgIcon";
import { parseTable } from "../../Parser/parseTables";
import { useActions } from "../../hooks";
import { PropsWithChildren } from "react";

interface Props {
  node: Element
}

export function TableWrap({ node }: PropsWithChildren<Props>) {
  const { onFullScreen } = useActions();
  const { label, caption, header, body, id } = parseTable(node);

  return (
    <div
      data-role="table-wrap"
      className="flex flex-col border border-[var(--kx-border-2)] rounded-lg overflow-hidden my-6"
      id={id}
    >
      <div className="h-[54px] bg-[var(--kx-fill-1)] flex justify-between items-center px-4 group">
        <span className="text-sm font-semibold">{label}</span>
        <button
          onClick={() => id &&
            onFullScreen({
              id: id,
              type: "table",
            })
          }
          className="bg-blue-600 rounded h-[30px] px-2 hover:bg-blue-500 active:bg-blue-700 text-sm text-white flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <SvgIcon icon="icon-quanpingzhankai" />
          全屏查看
        </button>
      </div>

      <div className="p-4 md:w-full w-[calc(100vw-32px)]">
        <div className="text-sm mb-4">{caption}</div>
        <div className="w-full overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gray-100">
              {header?.map((row, rowIndex) => (
                <tr key={`h-${rowIndex}`}>
                  {row.cells.map((cell, cellIndex) => (
                    <th
                      key={`h-${rowIndex}-${cellIndex}`}
                      colSpan={cell.colspan}
                      rowSpan={cell.rowspan}
                      className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-pre-wrap"
                      style={{
                        textAlign: cell.align || "center",
                        verticalAlign: cell.valign || "middle",
                      }}
                    >
                      {cell.text}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {body?.map((row, rowIndex) => (
                <tr
                  key={`b-${rowIndex}`}
                  className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  {row.cells.map((cell, cellIndex) => (
                    <td
                      key={`b-${rowIndex}-${cellIndex}`}
                      colSpan={cell.colspan}
                      rowSpan={cell.rowspan}
                      className="border border-gray-300 px-2 py-1 text-gray-800 whitespace-pre-wrap"
                      style={{
                        textAlign: cell.align || "center",
                        verticalAlign: cell.valign || "middle",
                      }}
                    >
                      {cell.text || "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}