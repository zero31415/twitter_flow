$(document).ready(function(){

	console.log("main.js loaded");
	data = {}

	$.getJSON("data/main_data_sample.json", function(json) {
		data.tweets = json.tweets;
		data.users = json.users;
		filter.init();
		init_btns();
        console.log('All initialized');
	});

	function init_btns(){
		$("body").on("click", "#filter-language-english", function() {
			if ($(this).is(":checked")) {
	            // Is now checked
	            filter.checkedLanguages.english = true;
	            //filter.byLanguage();
			} else {
                // Is now unchecked
                filter.checkedLanguages.english = false;
                //filter.byLanguage();
			}
		});
		$("body").on("click", "#filter-language-chinese", function() {
			if ($(this).is(":checked")) { 
                // Is now checked
                filter.checkedLanguages.chinese = true;
                //filter.byLanguage();
			} else {
                // Is now unchecked
                filter.checkedLanguages.chinese = false;
                //filter.byLanguage();
			}
		});

		$("#slider-user-num").on("change", function(){
			filter.num_users = this.value;
			timeTravel.update();
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
	toColor = function (num) {
	    num >>>= 0;
	    var b = num & 0xFF,
	        g = (num & 0xFF00) >>> 8,
	        r = (num & 0xFF0000) >>> 16,
	        a = 1 ;
	    return "rgba(" + [r, g, b, a].join(",") + ")";
	}
});
