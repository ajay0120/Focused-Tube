from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List

class EmbeddingService:
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

    def embed(self, texts: List[str]) -> np.ndarray:
        return self.model.encode(
            texts,
            normalize_embeddings=True
        )

    def block_mask(
        self,
        texts: List[str],
        disinterests: List[str],
        threshold: float = 0.65
    ) -> List[bool]:
        """
        Returns a list of booleans indicating whether each text is blocked.
        """
        if not disinterests:
            return [False] * len(texts)

        text_vecs = self.embed(texts)
        dis_vecs = self.embed(disinterests)

        # cosine similarity
        similarities = text_vecs @ dis_vecs.T
        max_scores = similarities.max(axis=1)

        return (max_scores >= threshold).tolist()


embedding_service = EmbeddingService()
