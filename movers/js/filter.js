var filter = {};

filter.init = function() {
    
    // Check the control fields
    filter.data = data;
    filter.currentData = {};
    filter.excludedUsers = [];
    filter.languageFilter = [];
    

    map.init();
    time.init();
    
}


// Takes excludedUsers and generates new currentData object
filter.updateData() = function() {


}


// Take the excludedUsers generate a new currentData object and update all
// visualizations
filter.update = function() {

   filter.currentData = filter.updateData();

   map.update();
   timeTravel.update();
   timeLine.update();

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

filter.byCountry
