#Take dataset, adapt code from notebook to movies dataset, use different similarity measure, see if you can get better result
#if user hasn't rated movie: find most similar movies, compare ratings for similar users

import pandas as pd
import numpy as np
import warnings
import math
import sys
import random

class recommender:
     def __init__(self,movies = None, regularFeatures = None, path = None, debug = None):
          if debug == None:
               self.debug = False
          else:
               self.debug = debug
          if path == None:
               path = "./"
          if movies == None:
               movies = "movies2.csv"
          if regularFeatures == None:
               regularFeatures = "regularFeatures.csv"
          movies = "%s%s" % (path,movies)
          regularFeatures = "%s%s" % (path,regularFeatures)
          #
          ## read CSV files
          self.moviesDababy=pd.read_csv(movies)
          self.features=pd.read_csv(regularFeatures)
          self.features['id']=self.moviesDababy['id']
          
     def featureSimilarity(self,id,returnNumber=None):
          returnList=[]
          if returnNumber==None:
               returnNumber=2
          debug = self.debug
          movies2=self.features
          if not (movies2['id']==id).any():
               newrow=random.randint(0,301)
               id=movies2.iloc[newrow,27]
               # Movie not found, picked random id') 	
          # inputting id:
          if debug:
               print(id)
          comparisonRow=movies2.loc[movies2['id']==id]
          otherRows=movies2.loc[movies2['id']!=id]
          comparisonRowClean=comparisonRow.iloc[:,np.r_[1:7,9:26]]
          otherRowClean=otherRows.iloc[:,np.r_[1:7,9:26]]
          arraySmall=comparisonRowClean.to_numpy()
          arrayBig=otherRowClean.to_numpy()
          #2FOLLOW: potentially:
          comparisonRowClean1=comparisonRow.iloc[:,np.r_[1:7]]
          comparisonRowClean2=comparisonRow.iloc[:,np.r_[9:26]]
          # denominator
          a2=np.sqrt(np.sum(np.square(arraySmall)))
          b2=np.sqrt(np.sum(np.square(arrayBig),axis=1))
          productsN=arraySmall*arrayBig
          sums=np.sum(productsN,axis=1)
          productsD=a2*b2
          final=sums/productsD
          listFinal=final.tolist()
          idNew=otherRows['id']
          listID=idNew.to_list()
          listTuple=zip(listFinal,listID)         
          huh=sorted(listTuple,key=lambda x:x[0],reverse=True)
          highestList=np.sort(final)[::-1]
          if returnNumber ==2:
               returnList.append(huh[0][1])
               returnList.append(huh[1][1])
               return returnList
          for i in range(0,returnNumber):
               returnList.append(huh[i][1])
          return set(returnList)