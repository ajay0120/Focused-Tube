from sentence_transformers import SentenceTransformer
import numpy as np

class EmbeddingService:
    def __init__(self):
        # Fast + good enough for production
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

    def embed(self, texts: list[str]) -> np.ndarray:
        return self.model.encode(
            texts,
            normalize_embeddings=True
        )

    def is_blocked(self, query: str, disinterests: list[str], threshold: float = 0.75):
        if not disinterests:
            return False, 0.0

        query_vec = self.embed([query])[0]
        dis_vecs = self.embed(disinterests)

        similarities = dis_vecs @ query_vec  # cosine similarity
        max_score = float(similarities.max())

        return max_score >= threshold, max_score


embedding_service = EmbeddingService()
