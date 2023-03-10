export enum OpenAIModel {
  DAVINCI_TURBO = "gpt-3.5-turbo"
}

interface KindleNotebook {
  title: string;
  author: string;
  highlights: KindleSection[];
  embeddings: KindleEmbedding[];
}

interface KindleSection {
  sectionTitle: string;
  highlights: KindleHighlight[];
}

interface KindleHighlight {
  type: string;
  page: string;
  highlight: string;
}

interface KindleEmbedding {
  title: string;
  author: string;
  sectionTitle: string;
  type: string;
  page: string;
  highlight: string;
  embedding: number[];
}

export type { KindleNotebook, KindleSection, KindleEmbedding };
