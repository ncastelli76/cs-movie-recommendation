#!/usr/bin/python3
from flask import Flask, jsonify, request
import sys
import os
sys.path.append(os.environ["REC_BASE_DIR"]+"/models/rac2/")
from recommender import recommender

app = Flask(__name__)
#
## Activate class
#
## if need many
models = {}
models["rac2"] = recommender(path=os.environ["REC_BASE_DIR"]+"/models/rac2/")

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
