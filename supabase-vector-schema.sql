-- Enable the pgvector extension to work with embedding vectors
CREATE EXTENSION IF NOT EXISTS vector;

-- Create a table to store your curriculum documents
CREATE TABLE IF NOT EXISTS curriculum_documents (
  id bigserial primary key,
  content text, -- the text paragraph from the textbook
  metadata jsonb, -- subject, tier, page number, etc.
  embedding vector(768) -- 768 is the exact dimension size for Google's Gemini text-embedding-004 model
);

-- Create a function to similarity-search for documents
CREATE OR REPLACE FUNCTION match_curriculum_documents(
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  filter_subject text DEFAULT NULL
)
RETURNS TABLE (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    curriculum_documents.id,
    curriculum_documents.content,
    curriculum_documents.metadata,
    1 - (curriculum_documents.embedding <=> query_embedding) AS similarity
  FROM curriculum_documents
  WHERE 1 - (curriculum_documents.embedding <=> query_embedding) > match_threshold
    -- Optional: Only return results for a specific subject if provided
    AND (filter_subject IS NULL OR curriculum_documents.metadata->>'subject' = filter_subject)
  ORDER BY curriculum_documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
