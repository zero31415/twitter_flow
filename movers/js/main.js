$(document).ready(function(){

	console.log("main.js loaded");
	data = {}
	
	$.getJSON("data/main_data_sample.json", function(json) {
		data.tweets = json.tweets;
		data.users = json.users;
		filter.init();
                console.log('All initialized');
	});

});
