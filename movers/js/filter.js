filter = {};

filter.init = function() {
    
    // Check the control fields
    filter.data = data;
    filter.currentData = {};
    filter.excludedUsers = [];
    filter.languageFilter = [];
    // Generate a hashmap user -> tweets
    console.log('Generating UserTweet Hashmap');
    filter.tweetsByUser = _makeUserTweetHashMap();
    filter.num_users = 10;
    console.log('Done');

    //map.init();
    //timeLine.init();
    //timeTravel.init();    
}

// Generate a hashmap to find tweets quickly by user id. {'user_id': [tweet,
// tweet, ...], ...}
var _makeUserTweetHashMap = function() {
    var tweetsByUser = {};

    var nTweets = filter.data.tweets.length;
    var tweets = filter.data.tweets

    for(i = 0; i < nTweets; i++) {
        var tweet = tweets[i]
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


filter.template = function(refilter, negative) {
    
    var data;
    if(refilter) {
        data = filter.currentData;
    } else {
        data = filter.data;
    }


    // Filtering operation
    // and store data.users  


    data.tweets = [];
    for(i = 0; i < data.users.length; i++){
        var currentID = data.users['u_id'];
        data.tweets.concat(filter.tweetsByUser[currentID]
    }
    // 
    
    filter.currentData = data;
}

filter.tweetsByIser[userID]


// Takes excludedUsers and generates new currentData object
filter.updateData() = function() {

    var nUsers = filter.data.users.length;
    var outData = {'users': [], 'tweets': []};

    for(i = 0; i < nUsers; i++){
        
        var currentId = filter.data.users[i]['u_id'];

        if(filter.excludedUsers.indexOf(currentId) > -1){ 
            continue;
        } else {
            filter.currentData.users.push(filter.data.users[i]);
            filter.currentData.tweets.concat(filter.tweetsByUser[currentId];
        } 
    }
}

/*
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
