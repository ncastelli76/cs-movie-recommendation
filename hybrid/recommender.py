#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Hybrid Recommendation System

1. Content-Based Filtering (TF-IDF + Cosine Similarity)
2. Rating Prediction using Transformer Models
3. Collaborative Filtering using SVD
"""

import pandas as pd
import numpy as np
import json
from surprise import dump

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from sklearn.model_selection import train_test_split

from datasets import DatasetDict, Dataset as HFDataset
import evaluate
from transformers import AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments, Trainer, DataCollatorWithPadding
from surprise import SVD, Reader
from surprise import Dataset as SurpriseDataset
from surprise.model_selection import cross_validate


def load_and_merge_dataset():
    df_credits = pd.read_csv('tmdb_5000_credits.csv')
    df_movies = pd.read_csv('tmdb_5000_movies.csv')
    df_credits.columns = ['id', 'title_dummy', 'cast', 'crew']
    return df_movies.merge(df_credits, on='id')


def extract_names(json_str):
    """
    Converts JSON list into comma-separated names.
    """
    try:
        items = json.loads(json_str)
        return ", ".join([entry['name'] for entry in items])
    except:
        return ""

def compute_weighted_rating(df, m, C=6.0):
    v = df['vote_count']
    R = df['vote_average']
    return (v / (v + m) * R) + (m / (m + v) * C)


def build_content_based_filtering(df):
    df['overview'] = df['overview'].fillna("")
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['overview'])
    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)
    title_to_idx = pd.Series(df.index, index=df['title']).drop_duplicates()
    return tfidf_matrix, cosine_sim, title_to_idx

def recommend_similar_movies(title, df, cosine_sim, title_to_idx, top_k=10):
    idx = title_to_idx[title]
    scores = list(enumerate(cosine_sim[idx]))
    ranked = sorted(scores, key=lambda x: x[1], reverse=True)
    movie_indices = [i[0] for i in ranked[1:top_k+1]]
    return df['title'].iloc[movie_indices]

def map_rating_to_label(score):
    if score >= 7.5:
        return 2
    elif score >= 6.5:
        return 1
    else:
        return 0


def build_combined_text(df):

    df["text_cast"] = df["cast"].apply(extract_names)
    df["text_genres"] = df["genres"].apply(extract_names)
    df["text_keywords"] = df["keywords"].apply(extract_names)
  #  df["text_overview"] = df["overview"].apply(extract_names)

    df["text"] = (
        "Cast: " + df["text_cast"].fillna("") +
   #     " | Overview: " + df["text_overview"].fillna("") +
        " | Genres: " + df["text_genres"].fillna("") +
        " | Keywords: " + df["text_keywords"].fillna("")
    )

    df["label"] = df["vote_average"]

    df = df[["text", "label"]]

    print("Remaining columns:", df.columns.tolist())
    return df

tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")

def preprocess_function(batch):
    """
    Tokenize ONLY the combined text field.
    """
    return tokenizer(
        batch["text"],
        truncation=True,
        padding="max_length"
    )


def prepare_transformer_dataset(df):
    df['label'] = list(map(map_rating_to_label, df['label']))
    train_df, test_df = train_test_split(df, test_size=0.2, random_state=42)
    val_df, test_df = train_test_split(test_df, test_size=0.5, random_state=42)
    return train_df, val_df, test_df

def train_transformer_model(train_df, val_df, test_df):

    train_ds = HFDataset.from_pandas(train_df)
    val_ds = HFDataset.from_pandas(val_df)
    test_ds = HFDataset.from_pandas(test_df)

    tokenized = DatasetDict({
        "train": train_ds.map(preprocess_function, batched=True, remove_columns=train_ds.column_names),
        "validation": val_ds.map(preprocess_function, batched=True, remove_columns=val_ds.column_names),
        "test": test_ds.map(preprocess_function, batched=True, remove_columns=test_ds.column_names),
    })

    tokenized["train"] = tokenized["train"].add_column("label", train_df["label"].tolist())
    tokenized["validation"] = tokenized["validation"].add_column("label", val_df["label"].tolist())
    tokenized["test"] = tokenized["test"].add_column("label", test_df["label"].tolist())

    data_collator = DataCollatorWithPadding(tokenizer)
    accuracy = evaluate.load("accuracy")

    def compute_metrics(eval_pred):
        preds, labels = eval_pred
        preds = np.argmax(preds, axis=1)
        return accuracy.compute(predictions=preds, references=labels)

    model = AutoModelForSequenceClassification.from_pretrained(
        "distilbert-base-uncased",
        num_labels=3
    )

    args = TrainingArguments(
        output_dir="movie_rating_model",
        learning_rate=2e-5,
        per_device_train_batch_size=16,
        num_train_epochs=20,
        weight_decay=0.01,
        eval_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
        report_to="none"
    )

    trainer = Trainer(
        model=model,
        args=args,
        train_dataset=tokenized["train"],
        eval_dataset=tokenized["validation"],
        tokenizer=tokenizer,
        data_collator=data_collator,
        compute_metrics=compute_metrics,
    )

    trainer.train()
    trainer.save_model("saved_transformer")
    tokenizer.save_pretrained("saved_transformer")

    return trainer, tokenized

def build_svd_recommender():
    ratings = pd.read_csv("ratings_small.csv")
    reader = Reader()
    data = SurpriseDataset.load_from_df(
        ratings[['userId', 'movieId', 'rating']], reader
    )
    svd = SVD()
    cv_results = cross_validate(svd, data, measures=["RMSE", "MAE"], verbose=False)
    print("Average RMSE:", np.mean(cv_results["test_rmse"]))
    print("Average MAE:", np.mean(cv_results["test_mae"]))
    trainset = data.build_full_trainset()
    svd.fit(trainset)
    dump.dump("saved_svd", algo=svd)
    print("SVD model saved!")
    return svd, trainset

if __name__ == "__main__":

    df = load_and_merge_dataset()

    m = df['vote_count'].quantile(0.9)
  #  popular = df[df['vote_count'] >= m].copy()
    popular = df
    popular['score'] = popular.apply(lambda x: compute_weighted_rating(x, m), axis=1)
    popular = popular.sort_values("score", ascending=False)
    print(popular[['title', 'score']].head(10))

    tfidf_matrix, cosine_sim, title_to_idx = build_content_based_filtering(df)
    print(recommend_similar_movies("The Dark Knight Rises", df, cosine_sim, title_to_idx))

    popular = build_combined_text(popular)

    # Train transformer
    train_df, val_df, test_df = prepare_transformer_dataset(popular)
    trainer, tokenized = train_transformer_model(train_df, val_df, test_df)

    # Train SVD collaborative filtering
    svd_model, trainset = build_svd_recommender()
