import { Divider } from "./Divider";
import { ParsedTable } from "../Parser/parseTables";
import { useActions } from "../hooks";
import { SvgIcon } from "@/components/SvgIcon";

const Table: React.FC<{ table: ParsedTable; }> = ({ table }) => {

  const { onFullScreen } = useActions();

  return (
    <div className="w-full">
      {/* 标题 */}
      {table.label && (
        <div className="text-start text-[var(--kx-text-1)] text-sm font-semibold  mb-2">
          {table.label}
        </div>
      )}
      {/* 表格说明 */}
      {table.caption && (
        <div className="text-sm text-[var(--kx-text-2)] mb-4 text-start leading-[22px]">
          {table.caption}
        </div>
      )}
      {/* 表格容器：小屏时横向滚动 */}
      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 mb-4">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            {table.header?.map((row, rowIndex) => (
              <tr key={`h-${rowIndex}`}>
                {row.cells.map((cell, cellIndex) => (
                  <th
                    key={`h-${rowIndex}-${cellIndex}`}
                    colSpan={cell.colspan}
                    rowSpan={cell.rowspan}
                    className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-pre-wrap"
                    style={{
                      textAlign: cell.align|| "center",
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
            {table.body?.map((row, rowIndex) => (
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

      <div className="flex justify-end">
        <button className="text-blue-600 text-sm flex items-center gap-1" onClick={() =>  table.id && onFullScreen?.({ id: table.id, type: "table" })}>
          <SvgIcon icon="icon-quanpingzhankai" className=""/> 全屏查看
        </button>
      </div>
    </div>
  );
};

export const Tables = ({ data }: { data: ParsedTable[] }) => {


  return (
    <div className="flex flex-col">
      {data.map((item, index, self) => (
        <div key={item.id}>
          <Table key={item.id} table={item} />
          {self.length - 1 !== index && <Divider />}
        </div>
      ))}
    </div>
  );
};
