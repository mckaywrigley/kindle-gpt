import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import { FC, KeyboardEvent, useState } from "react";

interface SearchProps {
  onAnswer: (query: string) => void;
}

export const Search: FC<SearchProps> = ({ onAnswer }) => {
  const [query, setQuery] = useState<string>("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onAnswer(query);
    }
  };

  return (
    <div className="relative w-full">
      <IconSearch className="absolute top-3 w-10 left-1 h-6 rounded-full opacity-50 sm:left-3 sm:top-4 sm:h-8" />

      <input
        className="h-12 w-full rounded-full border border-zinc-600 pr-12 pl-11 focus:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800 sm:h-16 sm:py-2 sm:pr-16 sm:pl-16 sm:text-lg"
        type="text"
        placeholder="Enter a query..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button onClick={() => onAnswer(query)}>
        <IconArrowRight className="absolute right-2 top-2.5 h-7 w-7 rounded-full bg-blue-500 p-1 hover:cursor-pointer hover:bg-blue-600 sm:right-3 sm:top-3 sm:h-10 sm:w-10 text-white" />
      </button>
    </div>
  );
};
