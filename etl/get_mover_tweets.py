from __future__ import unicode_literals
import rarfile
import json
import multiprocessing
import sys
import glob
import io
from pprint import pprint
import os
from functools import partial


rarfile.UNRAR_TOOL = "C:/Users/flinder/Downloads/unrar.exe"    
    
def decompress_file(filename):
    # Open connection to compressed archive
    compressed_file = rarfile.RarFile(filename)

    # Get the name of the tweetfile
    original_filename = compressed_file.infolist()[0].filename
    
    # Extract compressed file to current dir
    compressed_file.extract(original_filename)
    
    return(original_filename)
    
def get_tweet(line):
    # Exclude comma lines
    if not line.startswith('{'):
        return None
    
    # Load tweet as dictionary
    try:
        return(json.loads(line))
    except ValueError:  
        return None 
    
    
def process_file(archive_name, users, userfile, tweetfile):
    
    # Decompress
    print("Decompressing...")
    filename = decompress_file(archive_name)
    print("Done")
    
    # Find tweets by selected users
    with io.open(filename, 'r', encoding='utf-8', errors='replace') as infile:
        
        for i,line in enumerate(infile):
        
            # Extract tweet as dictinary
            tweet = get_tweet(line)
            if tweet is None:
                continue
            
            # Weed out not selected users
            id_ = tweet['user']['id_str']
            if id_ not in users:
                continue
                     
            # Extract the information we want
            user_info = tweet['user']
            del tweet['user']
            tweet['user_id'] = id_
            
            # Write output
            tweetfile.write(json.dumps(tweet) + '\n')
            userfile.write(json.dumps(user_info) + '\n')
    os.remove(filename)
                    

      

      
if __name__ == "__main__":
    
    files = glob.glob('D:/fridolin_linder/twitter_flow_data/*.rar')
    with io.open('selected_users.txt') as userfile:
        users = [e.strip('\n') for e in userfile.readlines()]
     
    users = set(users)     
    
    user_file = 'selected_user_info.json'
    tweet_file = 'selected_tweets.json'
                                    
    with io.open(user_file, 'a+', encoding='utf-8') as userfile,\
        io.open(tweet_file, 'a+', encoding='utf-8') as tweetfile:
        
        for i,f in enumerate(files):
            print "Processing {}".format(i)
            if i <=76:
                continue
            process_file(f, users, userfile, tweetfile)


# There will be some duplicates check after completion
        
    
    
    
    
    
    
    
#  