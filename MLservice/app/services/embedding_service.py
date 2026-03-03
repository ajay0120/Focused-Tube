from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List

class EmbeddingService:
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

    def block_mask(
        self,
        texts: List[str],
        category: str,
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
        category_vec = self.embed(category)
        category_sim = category_vec @ dis_vecs.T
        max_category_sim = category_sim.max() if category_sim.size > 0 else 0

        # cosine similarity
        similarities = text_vecs @ dis_vecs.T
        max_scores = similarities.max(axis=1)
        print(f"similarities={similarities}")
        print(f"max_scores={max_scores}")
        return ((max_category_sim>=threshold) | (max_scores >= threshold)).tolist()
    

    def embed(self, texts: List[str]) -> np.ndarray:
        if not texts:
            return np.array([])
        return self.model.encode(
            texts,
            normalize_embeddings=True
        )

    def cosine_similarity(self, vecs_a: np.ndarray, vecs_b: np.ndarray):
        return vecs_a @ vecs_b.T

embedding_service = EmbeddingService()