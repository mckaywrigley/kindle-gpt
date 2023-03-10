import { KindleEmbedding } from "@/types";
import { FC } from "react";

interface PassageProps {
  passage: KindleEmbedding;
}

export const Passage: FC<PassageProps> = ({ passage }) => {
  console.log(passage);
  return (
    <div className="p-4 rounded-lg mb-4 border border-zinc-600">
      <div className="text-lg font-bold">{passage.sectionTitle}</div>
      <div className="mt-1">{passage.highlight}</div>
      <div className="mt-2 italic text-xs">page {passage.page}</div>
    </div>
  );
};
