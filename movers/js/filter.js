filter = {};
console.log('Filter loaded');

filter.init = function() {
    
    // Check the control fields
    filter.data = data;
    filter.currentData = {};
    filter.excludedUsers = [];
    filter.languageFilter = [];
    // Generate a hashmap user -> tweets
    console.log('Generating UserTweet Hashmap');
    filter.tweetsByUser = _makeUserTweetHashMap();
    filter.user_num = 10;

    //map.init();
    //timeLine.init();
        //timeTravel.init();    
}

// Generate a hashmap to find tweets quickly by user id. {'user_id': [tweet,
// tweet, ...], ...}
var _makeUserTweetHashMap = function() {
    var tweetsByUser = {};

    nTweets = filter.data.tweets.length;
    tweets = filter.data.tweets

    for(i = 0; i < nTweets; i++) {

        var currentUser = tweetsByUser[tweets[i]['u_id']];

        if(currentUser){
            currentUser.push(data.tweet);
        } else {
            currentUser = [];
            currentUser.push(data.tweet);
        }
    } 
    return(tweetsByUser);
}


/*
// Takes excludedUsers and generates new currentData object
filter.updateData() = function() {
}

// Take the excludedUsers generate a new currentData object and update all
// visualizations
filter.update = function() {

   filter.currentData = filter.updateData();


    map.update(currentData);
    tim

}

// Take the user id, update the exclusionList and call update()
filter.byIndividualSelection = function(user_id) {
   filter.excludedUsers.push(user_id);
   filter.update()
}

// Get the 'checked' languages, find all users that don't spead these languages,
// append them to excludedUsers and call update
filter.byLanguage = function() {
    // Finds all user_ids that don't have language in language list
    filter.currentData = ;
    filter.update();
}
*/
