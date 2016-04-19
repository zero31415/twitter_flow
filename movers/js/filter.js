filter = {};

filter.init = function() {
    
    console.log('Initializing Filter...');
    // Set data
    filter.data = data;
    filter.data.userHash = _makeUserHash();
    filter.currentData = data;

    // Generate a hashmap user -> tweets
    filter.tweetsByUser = _makeUserTweetHashMap();

    // Set status of filter controls
    filter.checkedLanguages = {'english': true,
                               'chinese': true}; 

    // Initialize visualizations
    timeTravel.init();    
    console.log('Done');
}

filter.simpleInit = function() {
    
    filter.currentData = data;

    map.init();
    timeLine.init();
    timeTravel.init();

}

// Make the user json
var _makeUserHash = function() {
    var nUsers = filter.data.users.length;
    out = {};
    for(i = 0; i < nUsers; i ++) {
        var currentId = filter.data.users[i]['u_id'];
        out[currentId] = filter.data.users[i];
    }
    return(out);
}

// Synchronize the user and tweet array give the user json
var _synchData = function(data) {
    var users = data.userHash;
    data.users = [];
    for(var key in users) {
        data.users.push(users[key]);
        data.tweets.push(filter.tweetsByUser[key]);
    }
    return(data);
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

// Template for all filters
// Arguments:
// ---------
// refilter: bool, should the filter be applied to currentData or orginal data
// negative: bool, if filter is negative, things matching the criterion are
//    removed. If positive things matching the criterion are added from original
//    data.
filter.template = function(refilter, negative) {

    if(!refilter && !negative) {
        throw "You can't use a positive filter on the complete data";
    }
 
    var data;
    if(refilter) {
        data = filter.currentData;
    } else {
        data = filter.data;
    }

    var nUsers = data.users.length
    // Filtering operation happens here. Use the user json object
    if(negative) {
        // Remove users that match the criterion
        //
    } else {
        // Add users from original data (make sure not to generate duplicates)
    }
    //

    // Update data.users given filter.usersActive


    // Synchronize updated data.users and data.tweets
    data = _synchData(data);
     
    // Update the global data object
    filter.currentData = data;

    // Update all visualizations
    filter.update();
}


// Function to filter out one or more users
// Arguments:
// userIds: arr or str, user ids to be filtered
filter.bySelection = function(userIds, refilter=true, negative=true) {
   
    if(typeof userId == 'string') {
        userIds = [userId];
    }

    var data;
    if(refilter) {
        data = filter.currentData;
    } else {
        data = filter.data;
    }
     

    var nUsers = data.users.length

    // Filtering operation happens here. Operates on data.users
    if(negative) {
        // Remove users that match the criterion
    } else {
        // Add users from original data (make sure not to generate duplicates)
    }

    data.tweets = [];
    for(i = 0; i < nUsers; i++){
        var currentID = data.users['u_id'];
        data.tweets.concat(filter.tweetsByUser[currentID]);
    }
    
    // Update the global data object
    filter.currentData = data;

    // Update all visualizations
    filter.update();
}


// Take the excludedUsers generate a new currentData object and update all
// visualizations
filter.update = function() { 
    //map.update();
    //timeTravel.update();
    //timeLine.update();
    timeTravel.init();
}


/*
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

//Get all the languages in current data
//the languages are the ones in users.prof_lang
filter.initLanguages = function(){
    //get all the languages
    langList = {};

    for(i = 0;i < data.users.length; i++){
        
        var userLang = data.users[i].prof_lang;

        if (!langList[userLang]) {
            langList[userLang] = true;
        }

    }

    //filter.langList = 

    return langList

}

/*
neglect this part first
//Get the 'checked' laguages, find all users that do not have 
filter.byTweetLanguage = function(){

}

*/

filter.byCountry = function() {
//    
    
}

