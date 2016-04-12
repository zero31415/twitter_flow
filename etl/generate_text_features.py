from __future__ import unicode_literals
import json
import io
from pprint import pprint
import copy

INFILE = "../data/selected_tweets.json"
OUTFILE = "../data/user_tweet_features.json"

# Extract features

# Number of languages tweeted in
# Number of tweets (in the corpus)
# Amount of text per tweet 
# Total amount of text
# Size of vocabulary over amount of text
# Similarity to refugee text (cosine similarity) get a corpus first


# One user's doc:
# {'n_tweets': int,
#  'languages': set,
#  'vocab': set,
#  'vocab_size': int,
#  'hashtags': set,
#  'handles': set,
#  'n_hashtags': int,
#  'n_handles': int
# }

def update_user(tweet, user_doc):
    
    text = tweet['text']
    tokens = list(text.split(' '))
    user_doc['vocab'].update(tokens)
    user_doc['n_tweets'] += 1
    user_doc['languages'].update([tweet['lang']])
    hashtags = [e['text'] for e in tweet['entities']['hashtags']]
    user_doc['hashtags'].update(hashtags)
    handles = [e['screen_name'] for e in tweet['entities']['user_mentions']]
    user_doc['handles'].update(handles)
    user_doc['n_hashtags'] += len(hashtags)
    user_doc['n_handles'] += len(handles)


users = {}

with io.open(INFILE, 'r', encoding='utf-8') as infile:

    for i,line in enumerate(infile):

        try:
            tweet = json.loads(line)
        except ValueError:
            print "json error in line {}".format(i)

        id_ = tweet['user_id']

        if id_ in users:
            update_user(tweet, users[id_])
        else:
            users[id_] = {'vocab': set(), 
                          'vocab_size': 0,
                          'n_tweets': 0,
                          'languages': set(),
                          'hashtags': set(),
                          'handles': set(),
                          'n_hashtags': 0,
                          'n_handles': 0}
            users[id_]['user_id'] = id_
            update_user(tweet, users[id_])

        if i % 10000 == 0:
            print i
#        if i == 5:
#            break


# Transform sets to lists to make json serializable
print "Writing output..."

for user in users:
    doc = users[user]
    doc['vocab'] = list(doc['vocab'])
    doc['languages'] = list(doc['languages'])
    doc['hashtags'] = list(doc['hashtags'])
    doc['handles'] = list(doc['handles'])
    doc['vocab_size'] = len(doc['vocab'])
    del doc['vocab']


with io.open(OUTFILE, 'w+', encoding='utf-8') as outfile:
    
    for user in users:
        doc = users[user]
        #pprint(doc)
        outfile.write(unicode(json.dumps(users[user])))
        outfile.write('\n')
    

