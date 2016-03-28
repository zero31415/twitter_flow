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
import glob
import time
import rarfile
import datetime
import ntpath

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
    if user_dict['syria'] and user_dict['germany']:
        user_dict['selected'] = True

    return user_dict
                     

if __name__ == '__main__':


    INPUT_FILES = glob.glob('D:/fridolin_linder/twitter_flow_data/*.rar')
    OUTPUT_FILE = '../data/germany_syria_movers.txt'
    LOG_FILE = 'extract_movers.log'

    # Germany: NE 55.05814, 15.04205 SW 47.27021, 5.86624, 
    # Syria: NE 37.319, 42.384998 SW 32.3106, 35.727001
    germany = (55.05814, 5.86624, 47.27021, 15.04205)
    syria = (37.319, 35.727001, 32.3106, 42.384998)

    # First step: Generate a list of tweets for each user
    users = {}
    skipped = 0
    selected_users = set()

    # Set path to unrar application
    rarfile.UNRAR_TOOL = "C:/Users/flinder/Downloads/unrar.exe"
        
    start = time.time()
    for f in INPUT_FILES:
        
        # Counter for tweets without geotag
        no_coordinates = 0
                
        # Open connection to compressed archive
        compressed_file = rarfile.RarFile(f)
        
        # Get the name of the tweetfile
        original_filename = compressed_file.infolist()[0].filename
        
        # Extract compressed file to current dir
        print "Decompressing {}".format(original_filename)
        compressed_file.extract(original_filename)
        print "Done."

        # Open iterator to decompressed tweetfile and logfile
        with io.open(original_filename, 'r', encoding='utf-8') as infile, io.open(file=LOG_FILE, mode='a') as logfile:

            # Loop through every tweet in infile
            
            for i,line in enumerate(infile):
                #print line
                #sys.exit()
                # Exclude comma lines
                if not line.startswith('{'):
                    skipped += 1
                    continue

                # Load tweet as dictionary
                try:
                    tweet = json.loads(line)
                except ValueError: 
                    print "Line {line_number}: json ValueError error\n".format(line_number=i)
                    continue
                
                # Skip tweets w/o geotag
                if tweet['coordinates'] is None:
                    no_coordinates += 1
                    continue
                
                # Get current user id
                id_ = tweet['user']['id_str']

                # Skip if we already know we want this user
                if id_ in selected_users:
                    continue

                # Extract coordinates
                coord = tuple(tweet['coordinates']['coordinates'])
                 
                # If new user, update dictionary with updated entry
                if id_ not in users:
                    users[id_] = update_bb(coord, {'germany': False, 
                                                   'syria': False,
                                                   'selected': False})
                          
                else:
                    users[id_] = update_bb(coord, users[id_])
                
                # If user has tweets in both bounding boxes append to selected users
                if users[id_]['selected']:
                    selected_users.update([id_])
                
                # Status update
                if i % 100000 == 0:
                    print i
                    print "Found {} movers".format(len(list(selected_users)))
            
            print i
            
            # Measure required time for this file
            t = time.time() - start
            
            # Keep track of the files we are done with in case it crashes
            st = datetime.datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S')
            fname = ntpath.basename(f)
            log_entry = '[{}]: Finsihed {}. {} lines in {} seconds. Stats: {} tweets without coordinates in this file, {} movers identified in total\n'.format(st, fname, i, t, no_coordinates, len(list(selected_users)))
            logfile.write(log_entry)
            print log_entry
            start = time.time()

            #Make a backup of the users dictionary
            with io.open('user_dict_backup.json', 'w+') as backupfile:
                backupfile.write(unicode(json.dumps(users)))
            
            # Weird but apparently necessary
            infile.close()
            
            # Remove the temporary decompressed file
            os.remove(original_filename)
    # Write the final output to disk
    with io.open(OUTPUT_FILE,'w') as outfile:

        for user in list(selected_users):

            outfile.write(user)
            outfile.write('\n')
