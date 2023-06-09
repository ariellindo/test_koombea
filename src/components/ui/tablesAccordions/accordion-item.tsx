import {
  CaretDownOutlined,
  CaretRightOutlined,
  DeleteOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { MouseEvent, useState } from "react";
import TableFields from "./tableFields";
import { Dropdown, MenuProps } from "antd";

export type AccordionItemProps = {
  data: {
    tableName: string;
    fields: field[];
  };
};

export type field = {
  columnName: string;
  columnType: columnType;
  primaryKey: boolean;
};

export type columnType =
  | "char"
  | "int"
  | "boolean"
  | "date"
  | "float"
  | "double";

export default function AccordionItem({ data }: AccordionItemProps) {
  const [itemOpen, setItemOpen] = useState(false);

  const toggleItem = () => {
    setItemOpen(!itemOpen);
  };

  function addColumn({ tableName }: { tableName: string }): void {
    console.log(tableName);
  }

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    console.log("click", e);
  };

  const items: MenuProps["items"] = [
    {
      label: "Eliminar Columna",
      key: "1",
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  // console.log(data);
  return (
    <div className="flex flex-col">
      <div
        className={`accordionItemHead w-full min-h-40 bg-blue-300 text-blue-700 font-bold p-2 flex flex-row justify-between items-center cursor-pointer `}
        onClick={() => toggleItem()}
      >
        <div className="flex items-center">
          {itemOpen ? <CaretDownOutlined /> : <CaretRightOutlined />}
          <span className="ml-2">table_1</span>
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
          itemOpen ? "h-auto" : "h-0 overflow-hidden"
        }`}
      >
        <div className={`accordionItemContent w-full min-h-14`}>
          <TableFields />
        </div>
        <div
          className={`accordionItemFooter w-full min-h-14 border-t border-t-slate-100 p-2 flex flex-row justify-end items-center`}
        >
          <button
            onClick={() => addColumn({ tableName: data.tableName })}
            className="p-2 border border-emerald-700 rounded-md text-emerald-700 hover:bg-emerald-50 transition-colors"
          >
            Add Column
          </button>
        </div>
      </div>
    </div>
  );
}
