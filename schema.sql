--  RUN 1st
create extension vector;

-- RUN 2nd
create table naval_posts (
  id bigserial primary key,
  title text,
  subtitle text,
  html text,
  content text,
  length bigint,
  tokens bigint,
  embedding vector (1536)
);

create table naval_clips (
  id bigserial primary key,
  file text,
  content text,
  seconds bigint,
  embedding vector (1536)
);

-- RUN 3rd after running the scripts
create or replace function naval_posts_search (
  query_embedding vector(1536),
  similarity_threshold float,
  match_count int
)
returns table (
  id bigint,
  title text,
  subtitle text,
  html text,
  content text,
  length bigint,
  tokens bigint,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    naval_posts.id,
    naval_posts.title,
    naval_posts.subtitle,
    naval_posts.html,
    naval_posts.content,
    naval_posts.length,
    naval_posts.tokens,
    1 - (naval_posts.embedding <=> query_embedding) as similarity
  from naval_posts
  where 1 - (naval_posts.embedding <=> query_embedding) > similarity_threshold
  order by naval_posts.embedding <=> query_embedding
  limit match_count;
end;
$$;

create or replace function naval_clips_search (
  query_embedding vector(1536),
  similarity_threshold float,
  match_count int
)
returns table (
  id bigint,
  file text,
  content text,
  seconds bigint,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    naval_clips.id,
    naval_clips.file,
    naval_clips.content,
    naval_clips.seconds,
    1 - (naval_clips.embedding <=> query_embedding) as similarity
  from naval_clips
  where 1 - (naval_clips.embedding <=> query_embedding) > similarity_threshold
  order by naval_clips.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- RUN 4th
create index on naval_posts
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

create index on naval_clips
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);