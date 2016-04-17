$(document).ready(function(){

	console.log("main.js loaded");
	data = {}

	$.getJSON("data/main_data_sample.json", function(json) {
		data.tweets = json.tweets;
		data.users = json.users;
		filter.init();
		timeTravel.init();
		map.init();
	});

	$("#slider-user-num").on("change", function(){
		filter.num_users = this.value;
		timeTravel.init();
	});

});
