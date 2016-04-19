$(document).ready(function(){

	console.log("main.js loaded");
	data = {}

	$.getJSON("data/main_data_sample.json", function(json) {
		data.tweets = json.tweets;
		data.users = json.users;
		filter.init();
		//timeTravel.init();
		//map.init();
		init_btns();
        console.log('All initialized');
	});

	function init_btns(){
		$("body").on("click", "#filter-language-english", function() {
			if ($(this).is(":checked")) 
			{
				console.log("english checked");
			} else {
				console.log("english unchecked");
			}
		});
		$("body").on("click", "#filter-language-chinese", function() {
			if ($('#filter-language-chinese').is(":checked")) 
			{
				console.log("chinese checked");
			} else {
				console.log("chinese unchecked");
			}
		});

		$("#slider-user-num").on("change", function(){
			filter.num_users = this.value;
			timeTravel.init();
		});
	};


	getRandomColor = function () {
	    var letters = '0123456789ABCDEF'.split('');
	    var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.floor(Math.random() * 16)];
	    }
	    return color;
	}
});
