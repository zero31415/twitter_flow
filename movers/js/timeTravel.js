$(document).ready(function(){
	timeTravel = {}

	timeTravel.u_ids = [];
	timeTravel.cntrys = [];
	timeTravel.trips = [];
	timeTravel.cntry_val_map = {};
	timeTravel.timerange = [];

	timeTravel.init = function() {

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

		timeTravel.u_ids = timeTravel.u_ids.slice(0, 2);

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

	}
});