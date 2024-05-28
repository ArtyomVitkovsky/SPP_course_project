import { useEffect } from "react";
import ButtonIcon from "./ButtonIcon";

const Table = ({ data = [], columns = [], extraColumns = [], extraColumnsData = [], actionsColumns = [], columnsToExclude = [], columnsToMark = [] }) => {
  return (
    <div className="flex flex-col h-[calc(100vh-15rem)]">
      <div className="flex-grow overflow-y-auto">
        <table className="relative w-full">
          <thead>
            <tr className="text-xs">
              {
                columns.map((column, i) => {
                  return !columnsToExclude.includes(column)
                    ? <th
                      key={i}
                      className={
                        "uppercase text-left sticky top-0 py-3 px-2 bg-zinc-50 text-zinc-700 " +
                        (i === 0 ? "rounded-l-lg" : (i === columns.length - 1) ? "rounded-r-lg" : "")
                      }>
                      {column.replace("_", " ")}
                    </th>
                    : null;
                })
              }
              {
                extraColumns.map((extraColumn, i) => {
                  return extraColumnsData[extraColumn] != null
                    ? <th
                      key={i}
                      className={
                        "uppercase text-left sticky top-0 py-3 px-2 bg-zinc-50 text-zinc-700 " +
                        (i === 0 ? "rounded-l-lg" : (i === extraColumns.length - 1) ? "rounded-r-lg" : "")
                      }>
                      {extraColumn.replace("_", " ")}
                    </th>
                    : null
                })
              }
              {
                actionsColumns.map((actionColumn, i) => {
                  return <th
                    key={i}
                    className={
                      "uppercase text-left sticky top-0 py-3 px-2 bg-zinc-50 text-zinc-700 " +
                      (i === 0 ? "rounded-l-lg" : (i === actionsColumns.length - 1) ? "rounded-r-lg" : "")
                    }>
                  </th>
                })
              }
            </tr>
          </thead>
          <tbody className="">
            {
              data.map((item, i) => {

                return <tr key={i}>
                  {
                    columns.map((column, i) => {
                      return !columnsToExclude.includes(column)
                        ? <td key={i} className={"break-all font-medium px-2 py-3 text-zinc-500 " + (columnsToMark.includes(column) ? "text-zinc-800" : "")}>
                          {item[column]}
                        </td>
                        : null
                    })
                  }
                  {
                    extraColumns.map((column, i) => {
                      return extraColumnsData[column]
                        ? <td key={i} className={"break-all font-medium px-2 py-3 text-zinc-500 "}>
                          {extraColumnsData[column][item.id]}
                        </td>
                        : null
                    })
                  }
                  {
                    actionsColumns.map((column, i) => {
                      return <td
                        key={i}
                        className="break-all font-medium px-2 py-3 text-zinc-500"
                      >
                        <ButtonIcon type={column.type} title={column.title} iconName={column.iconName} onClick={() => column.action(item)} />
                      </td>
                    })
                  }
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
    </div >
  );
}

export default Table;
