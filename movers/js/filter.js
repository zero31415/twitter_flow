filter = {};

filter.init = function() {
    
    console.log('Initializing Filter...');
    // Check the control fields
    filter.data = data;
    filter.currentData = data;
    filter.excludedUsers = [];
    filter.languageFilter = [];
    // Generate a hashmap user -> tweets
    filter.tweetsByUser = _makeUserTweetHashMap();
 
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



// // Generate a hashmap to find tweets quickly by user id. {'user_id': [tweet,
// // tweet, ...], ...}
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
// negative: bool, is the filter positive or negative
filter.template = function(refilter, negative) {
 
    var data;
    if(refilter) {
        data = filter.currentData;
    } else {
        data = filter.data;
    }

    var nUsers = data.users.length
    // Filtering operation
    // and store data.users  
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

// Function to filter out one or more users
// Arguments:
// userIds: arr or str, user ids to be filtered
filter.bySelection = function(userIds, refilter=true, negative=false) {
   
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

    // Filtering operation
    for(i = 0; i < nUsers; i++) {
        var currentId = data.users['u_id'];
        if(userIds.indexOf(currentId) > -1) {
            data.users.splice(i, 1); 
        } else {
            continue;
        }
    }

    // and store data.users  
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

