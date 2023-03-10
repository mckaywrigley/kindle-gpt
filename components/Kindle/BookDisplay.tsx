import { KindleNotebook } from "@/types";
import { FC } from "react";

interface BookDisplay {
  notebook: KindleNotebook;
}

export const BookDisplay: FC<BookDisplay> = ({ notebook }) => {
  return (
    <div className="border border-zinc-600 rounded-lg p-4">
      <div className="text-xl font-bold">{notebook.title}</div>
      <div className="text-lg mt-1">{notebook.author}</div>

      {notebook.highlights.map((section, index) => {
        return (
          <div
            key={index}
            className="mt-4"
          >
            <div className="font-bold text-lg">{section.sectionTitle}</div>
            {section.highlights.map((highlight, index) => {
              return (
                <li
                  key={index}
                  className="text-md"
                >
                  {highlight.highlight}
                </li>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
