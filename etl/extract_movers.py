# Take preprocessed data from two bounding boxes and retrieve users (and 
# corresponding tweets) that changed bounding boxes
#
# Author: Fridolin Linder

from __future__ import unicode_literals
import io
import os
import sys
import json


def is_in(box, point):
    '''
    Check if point is within bounding box
    
    Arguments:
    ----------
    box: touple, (top_latitude, left_longitude, bottom_latitide,
        right_longitude)
    point: tuple, (latitude, longitude)

    All coordinates are in decimal degrees.

    Returns:
    ----------
    bool, true if in the box, false if not
    '''

    if point[0] < box[0] and \
       point[0] > box[2] and \
       point[1] > box[1] and \
       point[1] > box[3]:
        return True
    else:
        return False


def is_in_two(box_1, box_2, tweets):
    '''
    Determine if the given user has geolocated tweets in both bounding boxes.

    Arguments:
    ----------
    box_1: tuple, the first bounding box see format in is_in()
    box_2: tuple, the second bounding box see format in is_in()
    tweets: list, of the tweets of a single user. Each tweet is in json format
        and has to have a "coordinate": [lat, lon].

    Returns:
    ----------
    bool, true if the user has tweets in both boxes, false otherwise
    '''
    
    in_boxes = [False, False]

    # Loop through all of the user's tweets
    for doc in tweets:
        # Extract coordinates from tweet
        point = tuple(doc['coordinates']) 

        # Check if in either of the boxes
        if is_in(box_1, point):
            in_boxes[0] = True
        if is_in(box_2, point):
            in_boxes[1] = True

        # Check if there is at least one tweet in both boxes
        if all(in_boxes):
            return True 

    return False


if __name__ == '__main__':

    INPUT_FILE = 'filename here'
    OUTPUT_FILE = 'filename here'
    box_1 = 'insert coordinates here'
    box_2 = 'insert coordinates here'

    # First step: Generate a list of tweets for each user
    tweets_by_user = {}
    with io.open(INPUT_FILE, 'r', encoding='utf-8') as infile:

        for line in infile:

            tweet = json.loads(line)
            
            if tweet['user_id'] not in tweets_by_user.keys():
                tweets_by_user[tweet['user_id']] = [tweet]
            else:
                tweets_by_user[tweet['user_id']].append(tweet)


    # Second step: Get all users that have tweets in both bounding boxes
    selected_users = set()

    # Loop through all users in the dict genreated in last step
    for user in tweets_by_user:
        
        if is_in_two(box_1, box_2, tweets_by_user[user]):
            selected_users.update(user)
        else:
            continue


    # Third step write the tweets of the selected users to file
    outfile = io.open(OUTPUT_FILE, 'w+', encoding='utf-8')
    for user in tweets_by_user:

        if user in selected_users:
            for tweet in tweets_by_user[user]:
                outfile.write(json.dumps(tweet))
                outfile.write('\n')
        else:
            continue
            
    outfile.close()



        

