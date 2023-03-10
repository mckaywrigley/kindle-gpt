import { KindleNotebook } from "@/types";
import { FC } from "react";

interface BookListItemProps {
  notebook: KindleNotebook;
  onSelect: (notebook: KindleNotebook) => void;
}

export const BookListItem: FC<BookListItemProps> = ({ notebook, onSelect }) => {
  return (
    <div
      className="border border-gray-200 p-4 rounded-md shadow-md hover:opacity-50 cursor-pointer"
      onClick={() => onSelect(notebook)}
    >
      <div className="text-xl font-bold">{notebook.title}</div>
      <div>{notebook.author}</div>
    </div>
  );
};
