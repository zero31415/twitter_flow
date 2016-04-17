$(document).ready(function(){
	map = {};
	console.log("map.js loaded");

	map.init = function() {

		timeTravel.u_ids = [];
		timeTravel.cntrys = [];
		timeTravel.trips = [];
		timeTravel.cntry_val_map = {};
		timeTravel.timerange = [];
		$("#timeTravel-container").html("");

		console.log("timeTravel.js init");
		timeTravel.data = crossfilter(data.tweets);
		var timedataByTime = timeTravel.data.dimension(function(d) { return d.time; });
		timeTravel.timerange = [timedataByTime.bottom(Infinity)[0].time, timedataByTime.top(Infinity)[0].time];
		var timedataByUserid = timeTravel.data.dimension(function(d) { return d.u_id; });
		var timedataByCountry = timeTravel.data.dimension(function(d) { return d.cntry; });
		var timedataGroupsByUserid = timedataByUserid.group(function(u_id) { return u_id; });
		var arr = timedataGroupsByUserid.all();
		for (var i = 0; i < arr.length; i++) {
		    timeTravel.u_ids.push(arr[i].key);
		}
		var timedataGroupsByCountry = timedataByCountry.group(function(cntry) { return cntry; });
		var arr = timedataGroupsByCountry.all();
		for (var i = 0; i < arr.length; i++) {
		    timeTravel.cntrys.push(arr[i].key);
		    timeTravel.cntry_val_map[arr[i].key] = i;
		}

		timeTravel.u_ids = timeTravel.u_ids.slice(0, filter.num_users);

		timeTravel.u_ids.forEach(function(u_id) {
			timedataByUserid.filter(u_id);
			var arr = timedataByTime.bottom(Infinity);
			for (var i = 0; i < arr.length; i++) {
				var item = {}
				item.symbol = u_id;
				item.date = arr[i].time;
				item.cntry = arr[i].cntry;
				item.cntry_val = timeTravel.cntry_val_map[item.cntry];
			    timeTravel.trips.push(item);
			}
			timedataByUserid.filterAll();	
		});

		// Set the dimensions of the canvas / graph
		var margin = {top: 30, right: 20, bottom: 30, left: 50},
		    width = $("#timeTravel-container").width() - margin.left - margin.right,
		    height = $("#timeTravel-container").height() - margin.top - margin.bottom;

		// Parse the date / time
		var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse; 

		// Set the ranges
		var x = d3.time.scale().range([0, width]);
		var y = d3.scale.linear().range([height, 0]);

		// Define the axes
		var xAxis = d3.svg.axis().scale(x)
		    .orient("bottom").ticks(d3.time.months, 1);

		var yAxis = d3.svg.axis().scale(y)
		    .orient("left").ticks(120);

		// Define the line
		var line = d3.svg.line()
		    .x(function(d) { return x(d.date); })
		    .y(function(d) { return y(d.cntry_val); });

		// Adds the svg canvas
		var svg = d3.select("#timeTravel-container")
		    .append("svg")
		        .attr("width", width + margin.left + margin.right)
		        .attr("height", height + margin.top + margin.bottom)
		    .append("g")
		        .attr("transform", 
		              "translate(" + margin.left + "," + margin.top + ")");

	    mData = timeTravel.trips;

	    // q?
	    mData.forEach(function(d) {
			d.date = parseDate(d.date);
			d.cntry_val = +d.cntry_val;
	    });

	    // Scale the range of the data
	    x.domain(d3.extent(mData, function(d) { return d.date; }));
	    y.domain([0, d3.max(mData, function(d) { return d.cntry_val; })]); 

	    // Nest the entries by symbol
	    var dataNest = d3.nest()
	        .key(function(d) {return d.symbol;})
	        .entries(mData);

	    // Loop through each symbol / key
	    dataNest.forEach(function(d) {

	    	var c = getRandomColor();

	        svg.append("path")
	            .attr("class", "line")
	            .attr("d", line(d.values))
	            .attr("stroke", c)
	            .attr("opacity", 0.5)
				.on("mouseover", function(d) {
					d3.select(this).moveToFront();
					d3.select(this).classed("top", true);
					})
			    .on("mouseout", function(d) {
			    	d3.select(this).classed("top", false);
			    });

			svg.selectAll("dot")
				.data(d.values)
				.enter().append("circle")
				.attr("r", 3.5)
				.attr("cx", function(d) { return x(d.date); })
				.attr("cy", function(d) { return y(d.cntry_val); })
				.attr("fill", c);

	    });

	    // Add the X Axis
	    svg.append("g")
	        .attr("class", "x axis")
	        .attr("transform", "translate(0," + height + ")")
	        .call(xAxis);

	    // Add the Y Axis
	    svg.append("g")
	        .attr("class", "y axis")
	        .call(yAxis);

	    d3.select(".y.axis").selectAll(".tick").selectAll("text")
	    	.text(function(d) { return timeTravel.cntrys[d]; });

		d3.selection.prototype.moveToFront = function() {  
			return this.each(function(){
				this.parentNode.appendChild(this);
			});
		};




//
// Commons
//

var startDate,
	endDate,
	initialPosition,
	spatialPoints = [],
	entities = {};

module = {};
module.time_lower_bound = 0;
module.time_upper_bound = 0;

function entity() {

	// Setters
	this.id = function(_) {
      if (!arguments.length) return id;
      id = _;
      return this;
    };

    this.points = function(_) {
      if (!arguments.length) return points;
      points = _;
      return this;
    };

}

//
// Helpers
//

var weekday = new Array(7);
weekday[0]=  "Sun.";
weekday[1] = "Mon.";
weekday[2] = "Tue.";
weekday[3] = "Wed.";
weekday[4] = "Thu.";
weekday[5] = "Fri.";
weekday[6] = "Sat.";

function formatDate(date) {
	return d3.time.format("%Y-%m-%d %H:%M:%S").parse(date);
}

function print_filter(filter){
	var f=eval(filter);
	if (typeof(f.length) != "undefined") {}else{}
	if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
	if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
	console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
}

//
// Setup
//

// minDate = formatDate("2015-3-31 00:00:00");
// maxDate = formatDate("2015-4-30 23:59:59");
// startDate = formatDate("2015-3-31 21:15:00");
// endDate = formatDate("2015-4-30 21:15:00");
initialPosition = [42, 25];



	function convertTimestampToUTCDate(timestampInSeconds) {
		var targetTime = new Date(timestampInSeconds*1000);
		targetTime.setHours(targetTime.getHours() - targetTime.getTimezoneOffset()/60);
		return new Date(targetTime.getUTCFullYear(), targetTime.getUTCMonth(), targetTime.getUTCDate(),  targetTime.getUTCHours(), targetTime.getUTCMinutes(), targetTime.getUTCSeconds());
	}

	function timePretty(time) {
		return time.getUTCFullYear() + "/" + time.getUTCMonth() + "/" + time.getUTCDate() + " " + time.getUTCHours() + ":" + time.getUTCMinutes() + ":" + time.getUTCSeconds();
	}


		spatialPoints = [];

		// Add a LatLng object to each item in the dataset
		collection.forEach(function(d) {
			spatialPoints.push({
				coordinates: new L.LatLng(d.lat, d.lng),
				date: convertTimestampToUTCDate(d.timestamp),
				user: parseInt(d.user)
			});
		});

		// $("#slider").bind("valuesChanging", function(e, data){
		// 	updatePointsWithRange([data.values.min, data.values.max]);
		// });

		//
		// CROSSFILTER
		//

		var spatial = crossfilter(spatialPoints),
			all = spatial.groupAll(),
			dateDimension = spatial.dimension(function (d) { return d.date; }),
			usersDimension = spatial.dimension(function(d) { return d.user; }),
			usersGroup = usersDimension.group(),
			users = [];

		getDistinctUsers();

		function filterSpatialPointsWithRange(range) {
			entities = {};
			dateDimension.filterRange(range);
			dateDimension.top(Infinity).forEach(function (d) {
				// First time
				if (!entities[d.user]) {
					entities[d.user] = [];
				}
				// Add point to entity
				entities[d.user].push(d.coordinates);
			});
			$("#countUsers").html(Object.keys(entities).length);
			var timeDiff = range[1]-range[0];
			$("#countTime").html(Math.floor(timeDiff / 1000 / 60 / 60));
			$('.inner').stop().fadeTo('slow', 1);
			/*setTimeout(function() {
				$('.inner').fadeTo('slow', 0.4);
			}, 1000);*/
		}

		function getDistinctUsers() {
			usersGroup.top(Infinity).forEach(function (d) {
				users.push({user: d.key, color: getRandomColor()});
			});
		}

		// Count total number of points
		var n = all.reduceCount().value();
		console.log("There are " + n + " points in total.");
		$("#countUsers").html(n);
		//
		// MAP
		//

		var map = L.map('map').setView(initialPosition, 4),
			maplink = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/normal.day.grey/{z}/{x}/{y}/256/png8?app_id={app_id}&app_code={app_code}', {
						attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
						subdomains: '1234',
						mapID: 'newest',
						app_id: 'DemoAppId01082013GAL',
						app_code: 'AJKnXv84fjrb0KIHawS0Tg',
						base: 'base',
						minZoom: 0,
						maxZoom: 18
					}).addTo(map);

		// Initialize the SVG layer */
		map._initPathRoot();

		// Pick up the SVG from the map object */
		var svg = d3.select("#map").select("svg"),
			mapTrails = svg.append("g"),
			mapPoints = svg.append("g");

		// Use Leaflet to implement a D3 geometric transformation.
		function projectPoint(x, y) {
			var point = map.latLngToLayerPoint(new L.LatLng(x, y));
			this.stream.point(point.x, point.y);
		}

		var transform = d3.geo.transform({point: projectPoint}),
			path = d3.geo.path().projection(transform);

		//
		// Points
		//


		filterSpatialPointsWithRange([module.time_lower_bound, module.time_upper_bound]);

		var pointers = mapPoints
			.selectAll("circle")
			.data(users)
			.enter()
			.append("circle")
			.attr("r", 5)
			.attr("fill", function (d) { return d.color; })
			.attr("fill-opacity", 1)
			.attr("stroke", "black")
			.attr("stroke-width", 2)
			.attr("stroke-opacity", 1)
			.attr("opacity", 1)
			;

		var trails = mapTrails
			.selectAll("path")
			.data(users)
			.enter()
			.append("path")
			.attr("fill", "none")
	        .attr("stroke", function (d) { return d.color; })
	        .attr("stroke-width", 3)
	        ;

		function render() {
			pointers.attr("transform", function (d) {
				var coordinates = entities[d.user];
				if (coordinates && coordinates.length>0) {
					var header = coordinates[0];
					return "translate("+
						map.latLngToLayerPoint(header).x +","+
						map.latLngToLayerPoint(header).y +")";
				} else {
					return "translate(-5,-5)";
				}
			});
			trails.attr("d", function (d) {
				var coordinates = entities[d.user];
				if (coordinates && coordinates.length>0) {
					return path({type: "LineString", coordinates: convertToArrayXY(coordinates)});
				} else {
					return "M0,0";
				}
			});
		}

		function updateOnResize() {
			render();
		}

		function updatePointsWithRange(range) {
			filterSpatialPointsWithRange(range);
			render();
		}

		function convertToArrayXY(coordinates) {
			var array = [];
			coordinates.forEach(function(d) {
				array.push([d.lat, d.lng]);
			});
			return array;
		}

		map.on("viewreset", updateOnResize);
		updateOnResize();

		$(".loading").hide();
		$(".description").show();


	};
});