#-*- coding: utf-8 -*-
#Extract "user_id, tweet_id, coordinates[lat,lon], create_time" from raw twitter data
#To note that the input raw data has coordinates[lon, lat],
#while the output data has coordinates[lat,lon]
import json
import pprint

def isInBox(box, point):
    '''
    Check if the tweet point is in the boundingbox
    
    Arguments:
    ----------
    box: list, (NElon, NElat, SWlon, SWlat)
    point: list, (lon, lat)
    All coordinates are in decimal degrees.
    x is longitude
    y is latitude
    Returns:
    ----------
    boolean, true if in the box, false if not
    '''

    if point[0] > box[2] and point[0] < box[0] and \
       point[1] > box[3] and point[1] < box[1]:
        return True
    else:
        return False

def readAndWrite(filer, filew, box1, box2):
    '''
    Read a raw twitter file and append the tweets in two bounding
    boxes into a file
    
    Arguments:
    ----------
    filer: string, filename/path of the reading file
    filew: string, filename/path of the writing file
    box1: list, (bottomleftx, bottomlefty, toprightx, toprighty)
    box2: list, (bottomleftx, bottomlefty, toprightx, toprighty)
    To note that the new lines are appended to filew
    Returns:
    ----------
    No returns
    '''
    with open(filer, 'r') as fr:
        cc = 0
        dd = 0
        with open(filew, 'a') as fw:
            for line in fr:
            #print line
                dd += 1
                if line.find('{') != -1:
                    #print line
                    try:                        
                        tw = json.loads(line)
                        if tw['coordinates'] != None:
                            tweetID = tw['id_str']
                            userID = tw['user']['id_str']
                            userPT = tw['coordinates']['coordinates']                        
                            userTM = tw['created_at']
                            pt = [userPT[0], userPT[1]]
                            #print(str(isInBox(box1,pt)),str(isInBox(box2,pt)))
                            #determine if the point is in either of the boxes
                            if isInBox(box1,pt) == True or isInBox(box2,pt) == True:
                                twdic = {'user_id':userID, 'tweet_id':tweetID, 'create_time':userTM, 'coordinates':[userPT[1],userPT[0]]}
                                nl = json.dumps(twdic) + '\n'
                                fw.write(nl)
                                cc += 1
                                #if cc % 100 == 0:
                                    #print cc
                    except:
                        print filer
                        print "Ahh!"
                        print line
        print('Total tweets # ' + str(dd) + ' and box tweets # ' + str(cc))
                        


#box1-->boundingbox for Germany
box1 = [15.04205, 55.05814, 5.86624, 47.27021]
print('Hi' + str(isInBox(box1,[13,48])))
#box2-->boundingbox for Syria
box2 = [42.384998, 37.319, 35.727001, 32.3106]

for i in range(1,31):
    filer = 'distributedReader.2.0.minerBalin.2015.04.' + str(i).zfill(2) + '.out'
    filew = 'germany_syria_extract_v2.txt'
    readAndWrite(filer, filew, box1, box2)
                        


