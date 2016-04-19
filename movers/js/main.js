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
                            // Is now checked
                            filter.checkedLanguages.english = true;
                            // filter.byLanguage(negative=false);
			} else {
                            // Is now unchecked
                            filter.checkedLanguages.english = false;
                            // filter.byLanguage(negative=true);
			}
		});
		$("body").on("click", "#filter-language-chinese", function() {
			if ($(this).is(":checked")) 
			{ 
                            // Is now checked
                            filter.checkedLanguages.chinese = true;
                            // filter.byLanguage(negative=false);
			} else {
                            // Is now unchecked
                            filter.checkedLanguages.chinese = false;
                            // filter.byLanguage(negative=true);
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
