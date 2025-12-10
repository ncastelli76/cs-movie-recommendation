#!/usr/bin/python3
from flask import Flask, jsonify, request
import sys, os
from rac2.recommender import recommender

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
rac2_path = os.path.join(BASE_DIR, "rac2") + os.sep


app = Flask(__name__)
models = {}
models["rac2"] = recommender(path=rac2_path)

@app.route('/api/rec2/getSimilar', methods = ['GET'])
def get_similar():
    id = request.args.get('id')
    
    returnNumber=request.args.get('returnNumber','2')
    
    #ids = models['rac2'].featureSimilarity(int(id))
        #eturn jsonify(ids)
    ids = models['rac2'].featureSimilarity(int(id),int(returnNumber))
    return jsonify(ids)

if __name__ == '__main__':
    app.run(debug=True,port = 8080,host='0.0.0.0')
