import { KindleEmbedding, KindleNotebook } from "@/types";
import { IconArrowRight } from "@tabler/icons-react";
import { Configuration, OpenAIApi } from "openai";
import { FC, useEffect, useState } from "react";

interface EmbeddingButtonProps {
  book: KindleNotebook;
  apiKey: string;
  onEmbedding: (notebook: KindleNotebook) => void;
  onLoadingChange: (loading: boolean) => void;
  onLoadingMessageChange: (message: string) => void;
}

export const EmbeddingButton: FC<EmbeddingButtonProps> = ({ book, apiKey, onEmbedding, onLoadingChange, onLoadingMessageChange }) => {
  const [length, setLength] = useState(0);

  const handleEmbeddings = async (notebook: KindleNotebook, apiKey: string) => {
    onLoadingChange(true);

    const configuration = new Configuration({ apiKey });
    const openai = new OpenAIApi(configuration);

    let count = 1;
    const totalCount = notebook.highlights.reduce((acc, section) => acc + section.highlights.length, 0);

    let embeddings: KindleEmbedding[] = [];

    for (let i = 0; i < notebook.highlights.length; i++) {
      const section = notebook.highlights[i];

      for (let j = 0; j < section.highlights.length; j++) {
        const highlight = section.highlights[j];

        const res = await openai.createEmbedding({
          model: "text-embedding-ada-002",
          input: `${section.sectionTitle}. ${highlight.highlight}`
        });

        const [{ embedding }] = res.data.data;

        if (!embedding) {
          continue;
        }

        const newEmbedding: KindleEmbedding = {
          title: notebook.title,
          author: notebook.author,
          sectionTitle: section.sectionTitle,
          type: highlight.type,
          page: highlight.page,
          highlight: highlight.highlight,
          embedding
        };

        embeddings.push(newEmbedding);

        onLoadingMessageChange(`Embedding ${count} of ${totalCount}`);
        count++;

        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    const embeddedNotebook: KindleNotebook = {
      ...notebook,
      embeddings
    };

    onEmbedding(embeddedNotebook);

    const headers = "title,author,sectionTitle,type,page,highlight,embedding";
    const csv = embeddings
      .map((row) => {
        const embeddingString = row.embedding.join(",");
        return `"${row.title}","${row.author}","${row.sectionTitle}","${row.type}","${row.page}","${row.highlight}","[${embeddingString}]"`;
      })
      .join("\n");
    const csvData = `${headers}\n${csv}`;

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${embeddedNotebook.title}-embedded.csv`;
    link.click();

    onLoadingChange(false);
  };

  const getCost = (num: number) => {
    const tokensEstimate = num / 4;
    const cost = (tokensEstimate / 1000) * 0.0004;

    return `OpenAI Cost: ~$${cost.toFixed(4)} (Yes. It's that cheap.)`;
  };

  useEffect(() => {
    let count = 0;

    for (let i = 0; i < book.highlights.length; i++) {
      const section = book.highlights[i];

      for (let j = 0; j < section.highlights.length; j++) {
        const highlight = section.highlights[j];
        count += highlight.highlight.length;
      }
    }

    setLength(count);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="pt-4 border-t-2 border-gray-200 w-[600px] text-center font-bold">Import complete.</div>
      <div className="mt-2 text-center">Generate embeddings for this notebook to enable chat.</div>
      <div className="mt-2 text-center">You will also get a .csv file of your data.</div>
      <div className="mt-2 text-center">{`${getCost(length)}`}</div>

      <button
        className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 cursor-pointer rounded-md text-white flex"
        onClick={() => {
          handleEmbeddings(book, apiKey);
        }}
      >
        Start Embedding Process
        <IconArrowRight className="ml-1" />
      </button>
    </div>
  );
};
