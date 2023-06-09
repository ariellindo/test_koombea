import {
  CaretDownOutlined,
  CaretRightOutlined,
  DeleteOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import TableFields from "./tableFields";
import { Dropdown, MenuProps } from "antd";
import { Table, useTablesStore } from "@/stores/tablesStores";
import api from "@/api";

export type AccordionItemProps = {
  data: {
    tableName: string;
    fields: Field[];
  };
  isOpen: boolean;
  toggleTable: (tableName: string) => void;
};

export type Field = {
  columnName: string;
  columnType: columnType;
  primaryKey?: boolean;
};

export type columnType =
  | "char"
  | "int"
  | "boolean"
  | "date"
  | "float"
  | "double";

export default function AccordionItem({
  data,
  isOpen,
  toggleTable,
}: AccordionItemProps) {
  const { tableName, fields } = data;
  const addColumnToTable = useTablesStore((state) => state.addColumnToTable);
  const tables = useTablesStore((state) => state.tables);
  const removeTable = useTablesStore((state) => state.removeTable);

  const toggleItem = () => {
    toggleTable(tableName);
  };

  function addColumn({ tableName }: { tableName: string }): void {
    const table = tables.find((table) => table.tableName === tableName);
    const fields = table?.fields;

    const newField: Field = {
      columnName: `column_${fields && +fields?.length + 1}`,
      columnType: "char",
    };

    addColumnToTable(tableName, newField);
  }

  const handleMenuClick: MenuProps["onClick"] = async (e) => {
    e.domEvent.stopPropagation();
    removeTable(tableName);

    const tableId = tables.find(
      (table: Table) => table.tableName === tableName
    )?.id;
    tableId && (await api.schemas.removeTable(tableId.toString()));
  };

  const items: MenuProps["items"] = [
    {
      label: "Eliminar tabla",
      key: "eliminar-tabla",
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <div className="flex flex-col">
      <div
        className={`accordionItemHead w-full min-h-40 bg-blue-300 text-blue-700 font-bold p-2 flex flex-row justify-between items-center cursor-pointer hover:bg-blue-400/80 transition-colors`}
        onClick={() => toggleItem()}
      >
        <div className="flex items-center">
          {isOpen ? <CaretDownOutlined /> : <CaretRightOutlined />}
          <span className="ml-2">{tableName}</span>
        </div>

        <Dropdown menu={menuProps} placement="bottomLeft" trigger={["click"]}>
          <span
            onClick={(e) => e.stopPropagation()}
            className="p-2 hover:bg-blue-400/50 rounded-md flex items-center"
          >
            <EllipsisOutlined />
          </span>
        </Dropdown>
      </div>

      <div
        className={`AccordionItemContent ${
          isOpen ? "h-auto" : "h-0 overflow-hidden"
        }`}
      >
        <div className={`accordionItemContent w-full min-h-14`}>
          {fields.map((field, index) => (
            <TableFields
              key={index}
              field={field}
              tableName={tableName}
              fieldIndex={index}
            />
          ))}
        </div>
        <div
          className={`accordionItemFooter w-full min-h-14 border-t border-t-slate-100 p-2 flex flex-row justify-end items-center`}
        >
          <button
            onClick={() => addColumn({ tableName: tableName })}
            className="p-2 border border-emerald-700 rounded-md text-emerald-700 hover:bg-emerald-50 transition-colors"
          >
            Add Column
          </button>
        </div>
      </div>
    </div>
  );
}
