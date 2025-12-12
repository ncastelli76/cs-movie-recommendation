#!/usr/bin/python3
from flask import Flask, jsonify, request
import sys, os
from rac2.recommenderA import recommenderA
from rac3.recommender_trained import HybridRecommender
from rac3.recommender import load_and_merge_dataset, build_content_based_filtering
import pandas as pd
import numpy as np
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
rac2_path = os.path.join(BASE_DIR, "rac2") + os.sep
rac3_path = os.path.join(BASE_DIR, "rac3") + os.sep

PARENT_DIR = os.path.abspath(os.path.join(os.getcwd(), os.pardir))
json_path = os.path.abspath(os.path.join(PARENT_DIR, "movierecs-app/movieData.json"))


app = Flask(__name__)
models = {}
models["rac2"] = recommenderA(path=rac2_path)

df = load_and_merge_dataset(path=rac3_path)

def load_and_merge_dataset(path=None):
    prefix = ""
    if path != None:
        prefix = path
    df_credits = pd.read_csv(prefix + 'tmdb_5000_credits.csv')
    df_movies = pd.read_csv(prefix + 'tmdb_5000_movies.csv')
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
popular = df
popular['score'] = popular.apply(lambda x: compute_weighted_rating(x, m), axis=1)
popular = popular.sort_values("score", ascending=False)
df = load_and_merge_dataset(path=rac3_path)
tfidf_matrix, cosine_sim, title_to_idx = build_content_based_filtering(df)

models["rac3"] = HybridRecommender(df, tfidf_matrix, cosine_sim, title_to_idx, rac3_path)

@app.route('/api/rec2/getSimilar', methods = ['GET'])
def get_similar():
    id = request.args.get('id')
    
    returnNumber=request.args.get('returnNumber','7')
    
    #ids = models['rac2'].featureSimilarity(int(id))
        #eturn jsonify(ids)
    ids = models['rac2'].featureSimilarity(int(id),int(returnNumber))
    return jsonify(ids)

@app.route('/api/rec3/getSimilar', methods = ['GET'])
def get_similarH():
    ids = []
    id = request.args.get('id')
    max = request.args.get('max','7')
    ret = models['rac3'].recommend_similar_by_id(int(id),int(max))
    for i, t in ret:
        ids.append(int(i))
    return jsonify(ids)

if __name__ == '__main__':
    app.run(debug=True,port = 8080,host='0.0.0.0')
