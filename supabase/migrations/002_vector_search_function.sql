-- Function for vector similarity search
CREATE OR REPLACE FUNCTION match_vectors (
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  source_type varchar,
  source_id uuid,
  content text,
  similarity float,
  metadata jsonb
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    vectors.id,
    vectors.source_type,
    vectors.source_id::uuid,
    vectors.content,
    1 - (vectors.embedding <=> query_embedding) as similarity,
    vectors.metadata
  FROM vectors
  WHERE 1 - (vectors.embedding <=> query_embedding) > match_threshold
  ORDER BY vectors.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
