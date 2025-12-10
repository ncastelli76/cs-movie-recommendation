#!/usr/bin/python3
#Take dataset, adapt code from notebook to movies dataset, use different similarity measure, see if you can get better result
#if user hasn't rated movie: find most similar movies, compare ratings for similar users

import pandas as pd
import numpy as np
import warnings
import math
import sys
import random
import os
from recommender import recommender
    
#
## globals
rec = recommender(movies = "movies2.csv", regularFeatures = "regularFeatures.csv", path=os.environ["REC_BASE_DIR"]+"/models/rac2/")

## Hardcoded execution example
## for debug:
movie1=155
movie2=913
movie3=723
movie4=182
movie5=15201
returnIDs=[]

moviesSim=rec.featureSimilarity(155)
print(moviesSim)
moviesSim=rec.featureSimilarity(155)
print(moviesSim)

returnIDs.append(moviesSim)
returnIDs.append(rec.featureSimilarity(movie2))
returnIDs.append(rec.featureSimilarity(movie3))
returnIDs.append(rec.featureSimilarity(movie4))
returnIDs.append(rec.featureSimilarity(movie5))
print(returnIDs)
newList=[]
newList=moviesSim+rec.featureSimilarity(movie2)+rec.featureSimilarity(movie3)+rec.featureSimilarity(movie4)+rec.featureSimilarity(movie5)
print(newList)
print('exiting')
sys.exit()

#JSON.parse find user, get list of watched movies: print last 5, if less than 5 print the movies, append 5-len random movies from top 300 popular movies, if rating of movie less than 5, hatewatch=1, add the movie, if more than one movie rated less than 5 don't print it, continue, for each movie calculate feature similarity return list of 10 movies 

#Our website has a carousel that provides reccomendations based on past user ratings. 
