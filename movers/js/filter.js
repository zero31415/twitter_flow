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
            currentUser.push(tweet);
        } else {
            currentUser = [];
            currentUser.push(tweet);
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

// Get the 'checked' languages, find all users that don't speak these languages
// in their First profile language,
// append them to excludedUsers and call update
filter.byProfLanguage = function() {
    // Finds all user_ids that don't have language in language list
    filter.currentData = ;
    filter.update();

    //get the checkbox information
    langUserList = []
    langStatusFalse = []
    for language in checkbox:
        if the language is not checked:
            langStatusFalse.append(language)

    //get through the json object of users, if the users speaks languages in the exclude list
    //then add this person to the excludedUsers list
    for (var key in p) {
        );
  }
}

//Get all the languages in current data and
filter.byProfLanguage.getAllLang = function(){
    //get all the languages

}

//Get the 'checked' laguages, find all users that do not have 
filter.byTweetLanguage = function(){

}
*/
