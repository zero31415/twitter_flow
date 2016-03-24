# Take preprocessed data from two bounding boxes and retrieve users (and 
# corresponding tweets) that changed bounding boxes
#
# At the moment all tweets are loaded into memory. Has to be rewritten for
# larger amounts of data
#
# Author: Fridolin Linder

from __future__ import unicode_literals
import io
import os
import sys
import json
from pprint import pprint
import glob
import time


def is_in(box, point):
    '''
    Check if point is within bounding box
    
    Arguments:
    ----------
    box: tuple, (north_latitude, west_longitude, south_latitide,
        east_longitude)
    point: tuple, (longitude, latitude)

    All coordinates are in decimal degrees.

    Returns:
    ----------
    bool, true if in the box, false if not
    '''

    if point[1] < box[0] and \
       point[1] > box[2] and \
       point[0] > box[1] and \
       point[0] < box[3]:    
        return True
    else:
        return False

def update_bb(coord, user_dict):

    if is_in(germany, coord):
        user_dict['germany'] = True
    elif is_in(syria, coord):
        user_dict['syria'] = True

    return user_dict
                     

if __name__ == '__main__':


    INPUT_FILES = glob.glob("/Volumes/My Passport/GEOG597/04/*")

    OUTPUT_FILE = '../data/germany_syria_movers.txt'
    LOG_FILE = 'data_reduction.log'

    # Germany: NE 55.05814, 15.04205 SW 47.27021, 5.86624, 
    # Syria: NE 37.319, 42.384998 SW 32.3106, 35.727001
    germany = (55.05814, 5.86624, 47.27021, 15.04205)
    syria = (37.319, 35.727001, 32.3106, 42.384998)

    # First step: Generate a list of tweets for each user
    users = {}
    skipped = 0
    no_coordinates = 0
    selected_users = set()

    start = time.time()
    for f in INPUT_FILES:

        with io.open(f, 'r', encoding='utf-8') as infile , io.open(LOG_FILE, 'a') as logfile:

            for i,line in enumerate(infile):

                if not line.startswith('{'):
                    skipped += 1
                    continue

                try:
                    tweet = json.loads(line)
                except ValueError: 
                    #logfile.write("Line {line_number}: json ValueError error\n".format(line_number=i))
                    continue
                 
                if tweet['coordinates'] is None:
                    no_coordinates += 1
                    continue
                
                
                # Extrac information
                id_ = tweet['user']['id_str']

                if id_ in selected_users:
                    continue

                coord = tuple(tweet['coordinates']['coordinates'])
                 
                if id_ not in users:
                    users[id_] = update_bb(coord, {'germany': False, 'syria': False})
                          
                else:
                    users[id_] = update_bb(coord, users[id_])
                
                if users[id_]['germany'] and users[id_]['syria']:
                    selected_users.update(id_)
                    
                if i % 100000 == 0:
                    print i
                    print "skipped {}".format(skipped)
                    print "no coordinates {}".format(no_coordinates)
                    print "Found {} movers".format(len(list(selected_users)))

            print "Took {} seconds".format(time.time() - start)
            start = time.time()

 

    with io.open(OUTPUT_FILE,'w') as outfile:

        for user in list(selected_users):

            outfile.write(user)
            outfile.write('\n')
