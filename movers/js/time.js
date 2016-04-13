$(document).ready(function(){
	time = {}

	time.u_ids = []
	time.cntrys = []
	time.trips = []
	time.cntry_val_map = {}
	time.timerange = []

	time.init = function() {
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

		time.u_ids.forEach(function(u_id) {
			timedataByUserid.filter(u_id);
			var arr = timedataByTime.bottom(Infinity);
			for (var i = 0; i < arr.length; i++) {
				var item = {}
				item.symbol = u_id;
				item.date = arr[i].time;
				item.cntry = arr[i].cntry;
				item.price = time.cntry_val_map[item.cntry];
			    time.trips.push(item);
			}
			timedataByUserid.filterAll();	
		});

		// Set the dimensions of the canvas / graph
		var margin = {top: 30, right: 20, bottom: 30, left: 50},
		    width = 960 - margin.left - margin.right,
		    height = 600 - margin.top - margin.bottom;

		// Parse the date / time
		var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse; 

		// Set the ranges
		var x = d3.time.scale().range([0, width]);
		var y = d3.scale.linear().range([height, 0]);

		// Define the axes
		var xAxis = d3.svg.axis().scale(x)
		    .orient("bottom").ticks(5);

		var yAxis = d3.svg.axis().scale(y)
		    .orient("left").ticks(5);

		// Define the line
		var priceline = d3.svg.line()
		    .x(function(d) { return x(d.date); })
		    .y(function(d) { return y(d.price); });
		    
		// Adds the svg canvas
		var svg = d3.select("#time-container")
		    .append("svg")
		        .attr("width", width + margin.left + margin.right)
		        .attr("height", height + margin.top + margin.bottom)
		    .append("g")
		        .attr("transform", 
		              "translate(" + margin.left + "," + margin.top + ")");

		    data = time.trips;

		    data.forEach(function(d) {
				d.date = parseDate(d.date);
				d.price = +d.price;
		    });

		    // Scale the range of the data
		    x.domain(d3.extent(data, function(d) { return d.date; }));
		    y.domain([0, d3.max(data, function(d) { return d.price; })]); 

		    // Nest the entries by symbol
		    var dataNest = d3.nest()
		        .key(function(d) {return d.symbol;})
		        .entries(data);

		    // Loop through each symbol / key
		    dataNest.forEach(function(d) {

		        svg.append("path")
		            .attr("class", "line")
		            .attr("d", priceline(d.values)); 

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



	}
});