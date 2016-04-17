$(document).ready(function(){
	time = {}

	time.u_ids = [];
	time.cntrys = [];
	time.trips = [];
	time.cntry_val_map = {};
	time.timerange = [];

	time.init = function() {

		time.u_ids = [];
		time.cntrys = [];
		time.trips = [];
		time.cntry_val_map = {};
		time.timerange = [];
		$("#time-container").html("");

		console.log("time.js init");
		time.data = crossfilter(data.tweets);
		var timedataByTime = time.data.dimension(function(d) { return d.time; });
		time.timerange = [timedataByTime.bottom(Infinity)[0].time, timedataByTime.top(Infinity)[0].time];
		var timedataByUserid = time.data.dimension(function(d) { return d.u_id; });
		var timedataByCountry = time.data.dimension(function(d) { return d.cntry; });
		var timedataGroupsByUserid = timedataByUserid.group(function(u_id) { return u_id; });
		var arr = timedataGroupsByUserid.all();
		for (var i = 0; i < arr.length; i++) {
		    time.u_ids.push(arr[i].key);
		}
		var timedataGroupsByCountry = timedataByCountry.group(function(cntry) { return cntry; });
		var arr = timedataGroupsByCountry.all();
		for (var i = 0; i < arr.length; i++) {
		    time.cntrys.push(arr[i].key);
		    time.cntry_val_map[arr[i].key] = i;
		}

		time.u_ids = time.u_ids.slice(0, filter.num_users);

		time.u_ids.forEach(function(u_id) {
			timedataByUserid.filter(u_id);
			var arr = timedataByTime.bottom(Infinity);
			for (var i = 0; i < arr.length; i++) {
				var item = {}
				item.symbol = u_id;
				item.date = arr[i].time;
				item.cntry = arr[i].cntry;
				item.cntry_val = time.cntry_val_map[item.cntry];
			    time.trips.push(item);
			}
			timedataByUserid.filterAll();	
		});

		// Set the dimensions of the canvas / graph
		var margin = {top: 30, right: 20, bottom: 30, left: 50},
		    width = $("#time-container").width() - margin.left - margin.right,
		    height = $("#time-container").height() - margin.top - margin.bottom;

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
		var svg = d3.select("#time-container")
		    .append("svg")
		        .attr("width", width + margin.left + margin.right)
		        .attr("height", height + margin.top + margin.bottom)
		    .append("g")
		        .attr("transform", 
		              "translate(" + margin.left + "," + margin.top + ")");

	    mData = time.trips;

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
	    	.text(function(d) { return time.cntrys[d]; });

		d3.selection.prototype.moveToFront = function() {  
			return this.each(function(){
				this.parentNode.appendChild(this);
			});
		};

	}

	function getRandomColor() {
	    var letters = '0123456789ABCDEF'.split('');
	    var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.floor(Math.random() * 16)];
	    }
	    return color;
	}
});