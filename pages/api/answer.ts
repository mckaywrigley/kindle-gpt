import { OpenAIStream } from "@/utils/server";

export const config = {
  runtime: "edge"
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { title, author, prompt, apiKey } = (await req.json()) as {
      title: string;
      author: string;
      prompt: string;
      apiKey: string;
    };

    const stream = await OpenAIStream(title, author, prompt, apiKey);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};

export default handler;
