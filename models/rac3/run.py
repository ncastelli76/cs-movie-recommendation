from recommender_trained import HybridRecommender
from recommender import load_and_merge_dataset, build_content_based_filtering
import pandas as pd
import numpy as np
import json

df = load_and_merge_dataset()

def load_and_merge_dataset():
    df_credits = pd.read_csv('tmdb_5000_credits.csv')
    df_movies = pd.read_csv('tmdb_5000_movies.csv')
    df_credits.columns = ['id', 'title_dummy', 'cast', 'crew']
    return df_movies.merge(df_credits, on='id')


def extract_names(json_str):
    try:
        items = json.loads(json_str)
        return ", ".join([entry['name'] for entry in items])
    except:
        return ""

def compute_weighted_rating(df, m, C=6.0):
    v = df['vote_count']
    R = df['vote_average']
    return (v / (v + m) * R) + (m / (m + v) * C)
#------------------------------------------For cold start: top-k movies------------------------------------------------------------
m = df['vote_count'].quantile(0.9)
  #  popular = df[df['vote_count'] >= m].copy()
popular = df
popular['score'] = popular.apply(lambda x: compute_weighted_rating(x, m), axis=1)
popular = popular.sort_values("score", ascending=False)
print(popular[['title', 'score']].head(10))

df = load_and_merge_dataset()

tfidf_matrix, cosine_sim, title_to_idx = build_content_based_filtering(df)

hybrid = HybridRecommender(df, tfidf_matrix, cosine_sim, title_to_idx,"")

#------------------------------------------Content-based filtering------------------------------------------------------------
# by movie name
movie_title = "The Dark Knight Rises"
print(f"\nSimilar movies to '{movie_title}':")
print(hybrid.recommend_similar(movie_title))

# by movie id
movie_id = 155
print(f"\nSimilar movies to '{movie_id}':")
similar = hybrid.recommend_similar_by_id(movie_id)

for mid, title in similar:
    print(f"{mid} : {title}")


#Transformer-based rating prediction
text = (
    "Cast: Ginnifer Goodwin, Jason Bateman, Ke Huy Quan | "
    "Genres: Animation, Adventure, Comedy, Family | "
    "Keywords: animals, friendship, teamwork, mystery"
)
print(f"\nPredicted rating for :\n{text}")
print("Prediction:", hybrid.predict_text_score(text))


#-----------------------------------------Collaborative filtering------------------------------------------------------------------
user_id = 534
movie_id = 184
pred_rating = hybrid.predict_user_rating(user_id, movie_id)
print(f"\nPredicted rating of user {user_id} for movie {movie_id}: {pred_rating:.3f}")


#--------------------------------------------Hybrid recommendation (TF-IDF + SVD)-------------------------------------------------------- 
user_id = 423
#print(f"\nHybrid Recommendation for user {user_id} based on '{movie_title}' (From 1 - 5):")
#hybrid_results = hybrid.hybrid_recommend_by_id(movie_title, user_id)

#for title, score in hybrid_results:
#    print(f"  {title:50s}  predicted_score={score:.3f}")
movie_id = 155  # The Dark Knight
user_id = 423

print(f"\nHybrid Recommendation for user {user_id} based on movie {movie_id} (From 1 to 5):")

hybrid_results = hybrid.hybrid_recommend_by_id(movie_id, user_id)

for mid, title, score in hybrid_results:
    print(f"{mid:<8d} {title:50s} predicted_score={score:.3f}")
