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
from threading import Thread
import re

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

def update_bb(coord, user_dict, box1, box2):

    if is_in(box1, coord):
        user_dict['germany'] = True
    elif is_in(box2, coord):
        user_dict['syria'] = True
    if user_dict['syria'] and user_dict['germany']:
        user_dict['selected'] = True

    return user_dict


class Producer(object):

    def __init__(self, input_dir, buffer_size=5):
        self.queue = glob.glob(input_dir)
        self.buffer_size = buffer_size
        self.active = True
        self.buffer = []
        rarfile.UNRAR_TOOL = "C:/Users/flinder/Downloads/unrar.exe"
        print "Producer: Initialized producer with {} files in queue".format(len(self.queue))
 
    def _update_status(self):
        n_ready = len(buffer)
        if n_ready >= self.buffer_size:
            self.active = False
        else:
            self.active = True

    def _decompress_file(self, filename):
        # Open connection to compressed archive
        compressed_file = rarfile.RarFile(filename)

        # Get the name of the tweetfile
        original_filename = compressed_file.infolist()[0].filename
        
        # Extract compressed file to current dir
        compressed_file.extract(original_filename)
        print "Producer: Decompressed {}".format(original_filename)

    def run(self):
    
        global buffer
        global producer_done        
        while len(self.queue) > 0:

            if self.active:
                # Continue decompressing
                current_file = self.queue.pop()
                self._decompress_file(current_file)
                
                # Outfilename
                outname = re.sub('rar', 'out', ntpath.basename(current_file))
                buffer.append(outname)
                # Check if more needed
                self._update_status()
                

            else:
                # Stay inactive until consumer has consumed file
                while True:
                    time.sleep(10)
                    self._update_status()
                    if self.active:
                        break
                    else:
                        pass

        producer_done = True
        return None


class Consumer(object):

    def __init__(self, producer, logfilename="consumer.log"):
        self.queue = glob.glob('*.out')
        self.processed = []
        self.producer_done = False
        self.users = {}
        self.selected_users = set()
        self.producer = producer
        self.logfilename="consumer.log"

    def _process_file(self, filename):
        
        # Set bounding boxes
        # Germany: NE 55.05814, 15.04205 SW 47.27021, 5.86624, 
        # Syria: NE 37.319, 42.384998 SW 32.3106, 35.727001
        germany = (55.05814, 5.86624, 47.27021, 15.04205)
        syria = (37.319, 35.727001, 32.3106, 42.384998)

        start = time.time()

        with io.open(filename, 'r', encoding='utf-8') as infile, \
                io.open(file=self.logfilename, mode='a') as logfile:

            # Loop through every tweet in infile 
            for i,line in enumerate(infile):

                # Exclude comma lines
                if not line.startswith('{'):
                    continue

                # Load tweet as dictionary
                try:
                    tweet = json.loads(line)
                except ValueError:  
                    continue
                
                # Skip tweets w/o geotag
                if tweet['coordinates'] is None:
                    continue
                
                # Get current user id
                id_ = tweet['user']['id_str']

                # Skip if we already know we want this user
                if id_ in self.selected_users:
                    continue

                # Extract coordinates
                coord = tuple(tweet['coordinates']['coordinates'])
                 
                # If new user, update dictionary with updated entry
                if id_ not in self.users:
                    self.users[id_] = update_bb(coord, {'germany': False, 
                                                        'syria': False,
                                                        'selected': False},
                                                        germany,
                                                        syria)
                          
                else:
                    self.users[id_] = update_bb(coord, self.users[id_],
                                                germany, syria)
                
                # If user has tweets in both bounding boxes append to selected users
                if self.users[id_]['selected']:
                    self.selected_users.update([id_])
                
                # Status update
            
            # Measure required time for this file
            t = time.time() - start
            
            # Keep track of the files we are done with in case it crashes
            st = datetime.datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S')
            fname = ntpath.basename(f)
            log_entry = '[{}]: Finsihed {}. {} lines in {} seconds.\n'.format(st, fname, i, t)
            logfile.write(log_entry)
            start = time.time()

            #Make a backup of the users dictionary
            with io.open('user_dict_backup.json', 'w+') as backupfile:
                backupfile.write(unicode(json.dumps(users)))
            
            # Weird but apparently necessary
            infile.close()
            
            # Remove the temporary decompressed file
            self.processed.append(filename)
            os.remove(filename)

    def _update_status(self): 
        global buffer
        new = [f for f in buffer if f not in self.processed]
        self.queue.extend(new)


    def run(self):
        global consumer_done
        while True:
            
            # Check for files in directory
            self._update_status()
            
            if len(self.queue) == 0:
                # Stop the program if producer is done and queue is empty
                if producer_done:
                    consumer_done = True
                    return None
                # If queue is empty and producer not done wait and check again
                else:
                    time.sleep(10)
                    pass
            else:
                # Process all new files
                while len(self.queue) > 0:
                    current_file = self.queue.pop()
                    self._process_file(current_file)
                    print "Consumer: Processed {}".format(current_file)



if __name__ == '__main__':

    # Initialize producer and consumer
    producer = Producer('D:/fridolin_linder/twitter_flow_data/*.rar')
    consumer = Consumer(producer)
    buffer = []
    producer_done = False
    consumer_done = False

    producer_thread = Thread(target=producer.run)
    producer_thread.daemon = True
    producer_thread.start()
    
    consumer_thread = Thread(target=consumer.run)
    consumer_thread.daemon = True
    consumer_thread.start()

    while True:
        time.sleep(1)
        if producer_done and consumer_done:
            break