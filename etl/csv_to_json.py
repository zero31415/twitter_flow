#-*- coding: utf-8 -*-
#convert the csv file into json file
#a sample line of csv file is
#userid, tweetid, usertime, lat, lon
#a sample line of json file is
#{'user_id':..., 'tweet_id':..., 'create_time':..., 'coordinates':[...,...]}

import json
import pprint

filew = open('germany_syria_4month_pg.txt','w')
with open('postgisfiltered4month.csv','r') as f1:
    for line in f1:
        (userID,tweetID,userTM,lat,lon) = line[:-1].split(',')
        lat = float(lat)
        lon = float(lon)
        twdic = {'user_id':userID, 'tweet_id':tweetID, 'create_time':userTM, 'coordinates':[lat,lon]}
        nl = json.dumps(twdic) + '\n'
        filew.write(nl)
filew.close()
