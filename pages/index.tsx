import { Answer } from "@/components/Answer/Answer";
import { Import } from "@/components/Import/Import";
import { BookDisplay } from "@/components/Kindle/BookDisplay";
import { Footer } from "@/components/Layout/Footer";
import { Navbar } from "@/components/Layout/Navbar";
import { Passage } from "@/components/Passage";
import { Search } from "@/components/Search";
import { Settings } from "@/components/Settings";
import { KindleEmbedding, KindleNotebook } from "@/types";
import { cosSim } from "@/utils/app";
import endent from "endent";
import Head from "next/head";
import { Configuration, OpenAIApi } from "openai";
import { useEffect, useState } from "react";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [book, setBook] = useState<KindleNotebook>();
  const [answer, setAnswer] = useState<string>("");
  const [passages, setPassages] = useState<KindleEmbedding[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAnswer = async (query: string) => {
    if (!book) {
      return;
    }

    setLoading(true);
    setAnswer("");

    const configuration = new Configuration({ apiKey });
    const openai = new OpenAIApi(configuration);

    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: query
    });

    const [{ embedding }] = embeddingResponse.data.data;

    let similarities = book.embeddings.map((notebookEmbedding) => {
      const similarity = cosSim(embedding, notebookEmbedding.embedding);

      return {
        similarity,
        notebookEmbedding
      };
    });

    similarities = similarities.sort((a, b) => b.similarity - a.similarity);

    let length = 0;
    let count = 0;

    const selected = similarities.filter((similarity) => {
      length += similarity.notebookEmbedding.highlight.length;

      if (length < 1000 && count < 10) {
        count++;
        return true;
      }

      return false;
    });

    setPassages(selected.map((similarity) => similarity.notebookEmbedding));

    const prompt = endent`
    You are ${book.author}.

    Use the following passages from ${book.title} by ${book.author} to help provide an answer to the query: "${query}"

    Passsages:
    ${selected.map((similarity) => similarity.notebookEmbedding.highlight).join("\n\n")}

    Your answer:
    `;

    const answerResponse = await fetch("/api/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: book.title, author: book.author, prompt, apiKey })
    });

    if (!answerResponse.ok) {
      setLoading(false);
      throw new Error(answerResponse.statusText);
    }

    const data = answerResponse.body;

    if (!data) {
      return;
    }

    setLoading(false);

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setAnswer((prev) => prev + chunkValue);
    }
  };

  useEffect(() => {
    const KEY = localStorage.getItem("KINDLE_KEY");

    if (KEY) {
      setApiKey(KEY);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Kindle GPT</title>
        <meta
          name="description"
          content="AI search & chat on your Kindle highlights."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>

      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-1 overflow-auto px-10 pb-20">
          <div className="flex justify-center w-full mx-auto">
            <Settings
              apiKey={apiKey}
              onApiKeyChange={setApiKey}
            />
          </div>

          {apiKey.length === 51 ? (
            <Import
              book={book}
              apiKey={apiKey}
              onImport={setBook}
              onEmbedding={setBook}
              onClick={() => {
                setAnswer("");
                setPassages([]);
              }}
            />
          ) : (
            <div className="text-center text-2xl mt-7">
              Please enter your
              <a
                className="ml-2 mr-3 underline hover:opacity-50"
                href="https://openai.com/product"
              >
                OpenAI API key
              </a>
              in settings.
            </div>
          )}

          <div className="mt-4 max-w-[750px] mx-auto">
            {book ? (
              <div>
                {book.embeddings.length > 0 && (
                  <div className="my-8">
                    <Search onAnswer={handleAnswer} />
                  </div>
                )}

                {loading ? (
                  <>
                    <div className="mt-6 w-full">
                      <div className="font-bold text-2xl">Answer</div>
                      <div className="animate-pulse mt-2">
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded mt-2"></div>
                        <div className="h-4 bg-gray-300 rounded mt-2"></div>
                        <div className="h-4 bg-gray-300 rounded mt-2"></div>
                        <div className="h-4 bg-gray-300 rounded mt-2"></div>
                      </div>

                      <div className="font-bold text-2xl mt-6">Passages</div>
                      <div className="animate-pulse mt-2">
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded mt-2"></div>
                        <div className="h-4 bg-gray-300 rounded mt-2"></div>
                        <div className="h-4 bg-gray-300 rounded mt-2"></div>
                        <div className="h-4 bg-gray-300 rounded mt-2"></div>
                      </div>
                    </div>
                  </>
                ) : (
                  answer && (
                    <div className="my-8">
                      <div className="text-2xl font-bold mb-2">Answer</div>
                      <Answer text={answer} />
                    </div>
                  )
                )}

                {passages.length > 0 && (
                  <div className="my-8">
                    <div className="text-2xl font-bold mb-2">Passages</div>
                    {passages.map((passage, index) => {
                      return (
                        <div
                          key={index}
                          className="mb-4"
                        >
                          <Passage passage={passage} />
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="text-2xl font-bold mb-2">Notebook</div>
                <BookDisplay notebook={book} />
              </div>
            ) : null}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
