#-*- coding: utf-8 -*-
#convert the json file of 1st filtered users into csv file
#a sample line of json file is
#{"tweet_id": "...", "create_time": "...", "user_id": "...", "coordinates": [..., ...]}
#a sample line of csv file is
#tweetid,create_time,user_id,lat,lon

import json
import pprint

filew = open('germany_syria_extract.csv','w')
with open('germany_syria_extract.txt','r') as f1:
    for line in f1:
        tw = json.loads(line)
        tid = tw['tweet_id']
        crtime = tw['create_time']
        uid = tw['user_id']
        lat = str(tw['coordinates'][0])
        lon = str(tw['coordinates'][1])
        nl = tid + ',' + crtime + ',' + uid + ',' + lat + ',' + lon + '\n'
        filew.write(nl)
filew.close()
