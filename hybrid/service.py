#!/usr/bin/python3
from flask import Flask, jsonify, request
import sys, os
from recommender_trained import HybridRecommender

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
hybrid_path = os.path.join(BASE_DIR, "hybrid") + os.sep


app = Flask(__name__)
models = {}
models["hybrid"] = HybridRecommender(path=hybrid_path)


@app.route('/api/hybrid/hybridRecs', methods = ['GET'])
def hybrid_recs():
    recs = request.args.get('recs') #json in form of {"movie_id":123, "rating":4, "user_id":567, "timestamp":890123 }
    # get movie ids from recs
    import json
    recs_dict = json.loads(recs)
    movie_id = recs_dict.get("movie_id")
    ids = []
    for (value) in movie_id.items():
        ids += models['hybrid'].recommend_similar_by_id(value)
    print(ids)
    return jsonify(set(ids))

if __name__ == '__main__':
    app.run(debug=True,port = 8008,host='0.0.0.0')