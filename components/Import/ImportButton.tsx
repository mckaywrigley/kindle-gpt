import { KindleEmbedding, KindleNotebook, KindleSection } from "@/types";
import { parseHighlights } from "@/utils/app";
import { IconBookUpload } from "@tabler/icons-react";
import { FC } from "react";

interface ImportButtonProps {
  text: string;
  onImport: (notebook: KindleNotebook) => void;
  onLoadingChange: (loading: boolean) => void;
  onLoadingMessageChange: (message: string) => void;
}

export const ImportButton: FC<ImportButtonProps> = ({ text, onImport, onLoadingChange, onLoadingMessageChange }) => {
  const readCsvFile = async (file: File) => {
    onLoadingChange(true);

    onLoadingMessageChange("Importing Kindle Notebook...");

    const reader = new FileReader();

    reader.onload = async (e) => {
      const text = e.target?.result;

      let importedNotebook: KindleNotebook = {
        title: "",
        author: "",
        highlights: [],
        embeddings: []
      };

      let sections: KindleSection[] = [];

      if (typeof text === "string") {
        const rows = text.split("\n");
        rows.shift();

        const firstRow = rows[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

        importedNotebook.title = firstRow[0].replace(/"/g, "");
        importedNotebook.author = firstRow[1].replace(/"/g, "");

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const cleanedRow = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

          const title = cleanedRow[0].replace(/"/g, "");
          const author = cleanedRow[1].replace(/"/g, "");
          const sectionTitle = cleanedRow[2].replace(/"/g, "");
          const type = cleanedRow[3].replace(/"/g, "");
          const page = cleanedRow[4].replace(/"/g, "");
          const highlight = cleanedRow[5].replace(/"/g, "");
          const embedding = cleanedRow[6].replace(/"/g, "");

          const kindleEmbedding: KindleEmbedding = {
            title,
            author,
            sectionTitle,
            type,
            page,
            highlight,
            embedding: JSON.parse(embedding)
          };

          importedNotebook.embeddings.push(kindleEmbedding);

          const sectionIndex = sections.findIndex((section) => section.sectionTitle === sectionTitle);

          if (sectionIndex === -1) {
            const newSection: KindleSection = {
              sectionTitle,
              highlights: []
            };

            newSection.highlights.push(kindleEmbedding);
            sections.push(newSection);
          } else {
            sections[sectionIndex].highlights.push(kindleEmbedding);
          }
        }

        importedNotebook.highlights = sections;

        onImport(importedNotebook);

        onLoadingChange(false);
      }
    };

    reader.readAsText(file);
  };

  const readHtmlFile = async (file: File) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const text = e.target?.result;

      const notebook = parseHighlights(text);

      if (notebook) {
        onImport(notebook);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="mt-4 flex flex-col items-center justify-center">
      <div className="mb-4 italic">Import exported notebook from Kindle (.html) or previously embedded notebook (.csv).</div>
      <label
        htmlFor="file-upload"
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 cursor-pointer rounded-md text-white"
      >
        <span className="flex">
          {text}
          <IconBookUpload className="ml-2" />
        </span>
      </label>
      <input
        id="file-upload"
        type="file"
        className="sr-only"
        onChange={(e) => {
          if (e.target.files) {
            const file = e.target.files[0];

            if (file.name.split(".").pop() === "csv") {
              readCsvFile(file);
            } else if (file.name.split(".").pop() === "html") {
              readHtmlFile(file);
            }
          }
        }}
        accept=".csv,.html"
      />
    </div>
  );
};
