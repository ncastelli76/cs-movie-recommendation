import numpy as np
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from surprise import dump
#from sklearn.metrics.pairwise import linear_kernel


class HybridRecommender:

    def __init__(self, df, tfidf_matrix, cosine_sim, title_to_idx):
        self.df = df
        self.tfidf_matrix = tfidf_matrix
        self.cosine_sim = cosine_sim
        self.title_to_idx = title_to_idx
        self.transformer, self.tokenizer = self.load_transformer_model()
        self.svd = self.load_svd_model()

    def load_transformer_model(self, path="saved_transformer"):
        tokenizer = AutoTokenizer.from_pretrained(path)
        model = AutoModelForSequenceClassification.from_pretrained(path)
        model.eval()
        return model, tokenizer

    def load_svd_model(self, path="saved_svd"):
        _, algo = dump.load(path)
        return algo

    #TF-IDF Content-based Recommendation
    def recommend_similar(self, title, top_k=10):
        idx = self.title_to_idx[title]
        scores = list(enumerate(self.cosine_sim[idx]))
        ranked = sorted(scores, key=lambda x: x[1], reverse=True)
        movie_indices = [i[0] for i in ranked[1:top_k+1]]
        return self.df['title'].iloc[movie_indices].tolist()

    def recommend_similar_by_id(self, movie_id, top_k=10):
        # Find the movie title
        row = self.df.loc[self.df["id"] == movie_id]
        if row.empty:
            return f"Movie ID {movie_id} not found!"

        title = row["title"].values[0]

        # Get similar movie titles from content-based filtering
        similar_titles = self.recommend_similar(title, top_k)

        # Build list of (id, title) tuples
        results = []
        for t in similar_titles:
            movie_row = self.df.loc[self.df["title"] == t].iloc[0]
            results.append((movie_row["id"], movie_row["title"]))

        return results


    #Transformer Text Rating Prediction
    def predict_text_score(self, text):
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, padding=True)
        with torch.no_grad():
            outputs = self.transformer(**inputs)

        pred = torch.argmax(outputs.logits, dim=1).item()

        if pred == 2:
            return "High score (>=7.5)"
        elif pred == 1:
            return "Medium score (6.5–7.4)"
        else:
            return "Low score (<6.5)"

    #SVD User Rating Prediction
    def predict_user_rating(self, user_id, movie_id):
        pred = self.svd.predict(user_id, movie_id)
        return pred.est

    def recommend_for_user(self, user_id, top_k=10):
        movie_ids = self.df["id"].tolist()

        scores = []
        for mid in movie_ids:
            rating = self.svd.predict(user_id, mid).est
            scores.append((mid, rating))

        scores = sorted(scores, key=lambda x: x[1], reverse=True)

        top_movies = [mid for mid, _ in scores[:top_k]]
        return self.df[self.df["id"].isin(top_movies)][["title", "vote_average"]]


    #Hybrid Recommendation
    #Combine TF-IDF + SVD
    
    def get_title_by_id(self, movie_id):
        row = self.df.loc[self.df["id"] == movie_id]
        if row.empty:
            raise ValueError(f"Movie ID {movie_id} not found!")
        return row["title"].values[0]

    def hybrid_recommend(self, title, user_id, top_k=10):

        similar_movies = self.recommend_similar(title, top_k=30)
        candidate_df = self.df[self.df["title"].isin(similar_movies)]

        scored = []
        for _, row in candidate_df.iterrows():
            mid = row["id"]
            score = self.svd.predict(user_id, mid).est
            scored.append((row["title"], score))

        scored = sorted(scored, key=lambda x: x[1], reverse=True)
        return scored[:top_k]

    def hybrid_recommend_by_id(self, movie_id, user_id, top_k=10):
        title = self.get_title_by_id(movie_id)
        results = self.hybrid_recommend(title, user_id, top_k)
        enhanced_results = []
        for title, score in results:
            mid = self.df.loc[self.df["title"] == title, "id"].values[0]
            enhanced_results.append((mid, title, score))

        return enhanced_results
