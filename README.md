# Kindle GPT

AI search & chat on your Kindle highlights.

Supports .csv exporting of your embedded data.

Code is 100% open source.

Note: I recommend using on desktop only.

## How It Works

### Export Kindle Notebook

In the Kindle App you can export your highlights as a notebook.

The notebook provides you with a .html file of your highlights.

### Import & Parse Kindle Highlights

Import the .html file into the app.

It will parse the highlights and display them.

### Generate Embeddings

After parsing is complete, the highlights are ready to be embedded.

Kindle GPT uses [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings) (`text-embedding-ada-002`) to generate embeddings for each highlight.

The embedded text is the chapter/section name + the highlighted text. I found this to be the best way to get the most relevant passages.

You will also receive a downloaded .csv file of your embedded notebook to use wherever you'd like - including for importing to Kindle GPT for later use.

### Search Embedded Highlights

Now you can query your highlights using the search bar.

The 1st step is to get the cosine similarity for your query and all of the highlights.

Then, the most relevant results are returned (maxing out at ~2k tokens, up to 10).

### Create Prompt & Generate Answer

The results are used to create a prompt that feeds into GPT-3.5-turbo.

And finally, you get your answer!

## Data

All data is stored locally.

Kindle GPT doesn't use a database.

You can re-import any of your generated .csv files at any time to avoid having to re-embed your notebooks.

## Running Locally

1. Set up OpenAI

You'll need an OpenAI API key to generate embeddings and perform chat completions.

2. Clone repo

```bash
git clone https://github.com/mckaywrigley/kindle-gpt.git
```

3. Install dependencies

```bash
npm i
```

4. Run app

```bash
npm run dev
```

## Contact

If you have any questions, feel free to reach out to me on [Twitter](https://twitter.com/mckaywrigley)!
