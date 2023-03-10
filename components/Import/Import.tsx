import { KindleNotebook } from "@/types";
import { FC, useState } from "react";
import { EmbeddingButton } from "./EmbeddingButton";
import { ImportButton } from "./ImportButton";

interface ImportProps {
  book: KindleNotebook | undefined;
  apiKey: string;
  onImport: (notebook: KindleNotebook) => void;
  onEmbedding: (notebook: KindleNotebook) => void;
  onClick: () => void;
}

export const Import: FC<ImportProps> = ({ book, apiKey, onImport, onEmbedding, onClick }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  return (
    <div onClick={onClick}>
      {loading ? (
        <div className="mt-4 text-center">
          <div className="mt-2">This may take several minutes.</div>
          <div className="mt-2">Do not close this window.</div>

          <div className="mt-4 font-bold">{loadingMessage}</div>

          <div className="mt-6">
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-4 h-4 ml-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-4 h-4 ml-2 bg-blue-500 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      ) : book ? (
        book.embeddings.length > 0 ? (
          <ImportButton
            text="Import Different Notebook"
            onImport={onImport}
            onLoadingChange={setLoading}
            onLoadingMessageChange={setLoadingMessage}
          />
        ) : (
          <div className="space-y-4">
            <ImportButton
              text="Import Different Notebook"
              onImport={onImport}
              onLoadingChange={setLoading}
              onLoadingMessageChange={setLoadingMessage}
            />

            <EmbeddingButton
              book={book}
              apiKey={apiKey}
              onEmbedding={onEmbedding}
              onLoadingChange={setLoading}
              onLoadingMessageChange={setLoadingMessage}
            />
          </div>
        )
      ) : (
        <ImportButton
          text="Import Kindle Notebook"
          onImport={onImport}
          onLoadingChange={setLoading}
          onLoadingMessageChange={setLoadingMessage}
        />
      )}
    </div>
  );
};
