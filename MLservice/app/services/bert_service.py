from typing import List
import numpy as np
from app.models.video import Video
from app.services.embedding_service import embedding_service

class BertService:

    def __init__(self):
        self.interest_weight = 0.6
        self.disinterest_weight = 0.8
        self.disinterest_threshold = 0.6

    def rank_videos(
        self,
        videos: List[Video],
        interests: List[str],
        disinterests: List[str]
    ) -> List[Video]:

        if not videos:
            return []

        # Combine text dynamically
        video_texts = [
            f"{v.title} {v.description or ''} {v.channelTitle or ''}".lower()
            for v in videos
        ]

        video_embeddings = embedding_service.embed(video_texts)

        # Interest similarity
        if interests:
            interest_embeddings = embedding_service.embed(interests)
            interest_sim = embedding_service.cosine_similarity(
                video_embeddings,
                interest_embeddings
            )
            max_interest = interest_sim.max(axis=1)
        else:
            max_interest = np.zeros(len(videos))

        # Disinterest similarity
        if disinterests:
            dis_embeddings = embedding_service.embed(disinterests)
            dis_sim = embedding_service.cosine_similarity(
                video_embeddings,
                dis_embeddings
            )
            max_disinterest = dis_sim.max(axis=1)
        else:
            max_disinterest = np.zeros(len(videos))

        ranked = []

        for i, video in enumerate(videos):
            interest_score = float(max_interest[i])
            disinterest_score = float(max_disinterest[i])

            final_score = (
                (interest_score * self.interest_weight)
                - (disinterest_score * self.disinterest_weight)
            )

            is_blocked = disinterest_score > self.disinterest_threshold

            video.finalScore = round(final_score, 4)
            video.interestScore = round(interest_score, 4)
            video.disinterestScore = round(disinterest_score, 4)
            video.isBlocked = is_blocked

            if not is_blocked:
                ranked.append(video)

        ranked.sort(key=lambda v: v.finalScore, reverse=True)

        return ranked


bert_service = BertService()