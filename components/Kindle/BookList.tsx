import { KindleNotebook } from "@/types";
import { IconArrowLeft } from "@tabler/icons-react";
import { FC, useState } from "react";
import { BookDisplay } from "./BookDisplay";
import { BookListItem } from "./BookListItem";

interface BookListProps {
  notebooks: KindleNotebook[];
  onDelete: (notebooks: KindleNotebook[]) => void;
}

export const BookList: FC<BookListProps> = ({ notebooks, onDelete }) => {
  const [selected, setSelected] = useState<KindleNotebook>();

  const handleDelete = () => {
    const proceed = confirm("Are you sure you want to delete this book?");

    if (!proceed) return;

    const newBooks = notebooks.filter((notebook) => notebook.title !== selected?.title);
    localStorage.setItem("books", JSON.stringify(newBooks));
    onDelete(newBooks);
    setSelected(undefined);
  };

  return (
    <div>
      {selected ? (
        <div>
          <div className="flex justify-between">
            <button
              className="bg-zinc-500 hover:bg-zinc-700 text-white text-sm font-bold py-1 px-2 rounded flex items-center"
              onClick={() => setSelected(undefined)}
            >
              <IconArrowLeft size={20} />
              <div className="ml-1">back</div>
            </button>

            <button
              className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-1 px-2 rounded flex items-center"
              onClick={handleDelete}
            >
              <div className="ml-1">delete book</div>
            </button>
          </div>

          <div className="mt-6">
            <BookDisplay notebook={selected} />
          </div>
        </div>
      ) : (
        <div>
          {notebooks.map((notebook, index) => {
            return (
              <div
                key={index}
                className="mt-4"
              >
                <BookListItem
                  notebook={notebook}
                  onSelect={setSelected}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
