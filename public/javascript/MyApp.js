app.config(function ($routeProvider) {
	$routeProvider
		.when("/", {
			templateUrl: "/views/home.html",
		})
		.when("/messages", {
			templateUrl: "/views/messages.html",
		})
		.when("/themes", {
			templateUrl: "/views/themes.html",
			controller: "themes"
		})
		.when("/journeys", {
			templateUrl: "/views/journeys.html",
		})
		.when("/stories", {
			templateUrl: "/views/stories.html",
		})
		.when("/stream", {
			templateUrl: "/views/stream.html",
		});
});

app.controller('themes', function ($scope, $http, $filter) {
	var noOfdocs = [];
	var data = [];
	var count = 0;
	$scope.count = 0;
	$scope.datapoints = [];
	var dataOfThemesByTime = [], count = 0;
	var graphData = [];
	var brand = [];
	var employee = [];
	var product = [];
	var price = [];
	var sentiments = [];
	var timeVSsentiment = [];
	var datapoints = [];
	$http.get('/themesbytime').then(function (response) {
		var brand = 0, service = 0, employee = 0, product = 0, price = 0;
		for (var i = 0; i < response.data.aggregations["0"].results.length; i++) {
			for (var j = 0; j < response.data.aggregations["0"].results[i].aggregations["0"].aggregations["0"].aggregations["0"].results.length; j++) {
				switch (response.data.aggregations["0"].results[i].aggregations["0"].aggregations["0"].aggregations["0"].results[j].key) {
					case 'PRODUCT': product = response.data.aggregations["0"].results[i].aggregations["0"].aggregations["0"].aggregations["0"].results[j].aggregations["0"].value;
						break;
					case 'EMPLOYEE': employee = response.data.aggregations["0"].results[i].aggregations["0"].aggregations["0"].aggregations["0"].results[j].aggregations["0"].value;
						break;
					case 'SERVICE':  service= response.data.aggregations["0"].results[i].aggregations["0"].aggregations["0"].aggregations["0"].results[j].aggregations["0"].value;
						break;
					case 'PRICE': price = response.data.aggregations["0"].results[i].aggregations["0"].aggregations["0"].aggregations["0"].results[j].aggregations["0"].value;
						break;

				}
			}
			brand = response.data.aggregations["0"].results[i].aggregations["0"].aggregations["0"].aggregations["0"].results["0"].aggregations["0"].value;
			var d = response.data.aggregations["0"].results[i].key_as_string.substr(0,7 );
			
			dataOfThemesByTime.push({ x: d , brand: brand.toFixed(2), price: price.toFixed(2), product: product.toFixed(2), employee: employee.toFixed(2), service: service.toFixed(2) });
			brand = 0, service = 0, employee = 0, product = 0;
		}
		drawLineGraph('themesByTime', dataOfThemesByTime, ['Brand', 'Price', 'Product', 'Service', 'Employee'], "Time", ['brand', 'price', 'product', 'service', 'employee']);
	});

	
	$http.get('/themesbygroup').then(function (response) {
		for (var i = 0; i < response.data.aggregations["0"].results.length; i++) {
			var result = response.data.aggregations["0"].results[i].aggregations["0"].aggregations["0"].aggregations["0"].results;
			datapoints = [];
			for (var j = 0; j < result.length; j++) {
				data = [];
				for (var k = 0; k < result[j].aggregations[1].results.length; k++)
					data[data.length] = { 'sentiment': result[j].aggregations[1].results[k].key, 'records': result[j].aggregations[1].results[k].matching_results };
				datapoints[datapoints.length] = { 'graphId': count++, 'sentimentValue': result[j].aggregations["0"].value.toFixed(2), 'State': result[j].key, data: data };
			}
			$scope.datapoints[$scope.datapoints.length] = { 'group': response.data.aggregations["0"].results[i].key, datapoints: datapoints };
		}
		// console.log($scope.datapoints);
	})

	$scope.drawtThemesByGroup = function (id, data, sentimentValue) {
		if ($scope.count < 10) {
			$scope.count = $scope.count + 1;
			var width = 150,
				height = 150,
				radius = Math.min(width, height) / 2;

			var color = d3.scale.ordinal()
				.range(["#f44248","#08a7c4","#09c451"]);

			var arc = d3.svg.arc()
				.outerRadius(radius - 10)
				.innerRadius(radius - 40);

			var pie = d3.layout.pie()
				.sort(null)
				.value(function (d) { return d.records; });

			var svg = d3.select(id).append("svg")
				.attr("width", width)
				.attr("height", height)
				.append("g")
				.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


			/* d3.csv("data.csv", type, function(error, data) {
				if (error) throw error;					  
			 */var g = svg.selectAll(".arc")
				.data(pie(data))
				.enter().append("g")
				.attr("class", "arc");

			g.append("path")
				.attr("d", arc)
				.style("fill", function (d) { return color(d.data.sentiment); });

			g.append("text")
				.attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
				.attr("dy", ".35em")
				.text(function (d) { return d.data.sentiment; });

			g.append("text")
				.attr("dy", ".35em")
				.style("text-anchor", "middle")
				.text(function (d) { return sentimentValue; });

			/* 	});	 */
			function type(d) {
				d.records = +d.records;
				return d;
			}

		}
	}
	function drawLineGraph(elementname, data, labels, xLabels, yKeys) {
		Morris.Line({
			element: elementname,
			data: data,
			xkey: 'x',
			ykeys: yKeys,
			hideHover : 'auto',
			lineColors: ['#0c4cb2', '#ed8610', '#edda0f', '#0ac933', '#890ac9'],
			labels: labels,
			lineWidth: 7,
			parseTime : false,
			xLabels: xLabels
		});
	}

function x(d) { return d.income; }
function y(d) { return d.lifeExpectancy; }
function radius(d) { return d.population; }
function color(d) { return d.name; }
function key(d) { return d.name; }
function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  //var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
//  var month = months[a.getMonth()];
var month = a.getMonth();
  var time = month + year ;
//   return month;
return UNIX_timestamp; //need to change this, json contains month, so returning as is.
}
// Chart dimensions.
var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5},
    width = 1014 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

// Various scales. These domains make assumptions of data, naturally.
var xScale = d3.scale.log().domain([2, 8]).range([0, width]),
    yScale = d3.scale.linear().domain([-0.6, 0.2]).range([height, 0]),
    radiusScale = d3.scale.sqrt().domain([0, 500]).range([1, 50]),
    colorScale = d3.scale.category20();

// The x & y axes.
var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(12, d3.format(",d")),
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// Create the SVG container and set the origin.
var svg = d3.select("#themesRatingWithTime").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "gRoot")

// Add the x-axis.
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

// Add the y-axis.
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

// Add an x-axis label.
svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("NPS Rating");

// Add a y-axis label.
svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Sentiment");

// Add the year label; the value is set on transition.
var label = svg.append("text")
    .attr("class", "year label")
    .attr("text-anchor", "end")
    .attr("y", height - 50)
    .attr("x", width)
    .text(" ");

// Add the country label; the value is set on transition.
var countrylabel = svg.append("text")
    .attr("class", "country label")
    .attr("text-anchor", "start")
    .attr("y", 20)
    .attr("x", 20)
    .text(" ");

var sentimentlbl = svg.append("text")
    .attr("class", "other label")
    .attr("text-anchor", "start")
    .attr("y", 0)
    .attr("x", width - 300)
    .text(" ");

var npsratinglbl = svg.append("text")
    .attr("class", "other label")
    .attr("text-anchor", "start")
    .attr("y", 20)
    .attr("x", width - 300)
    .text(" ");

var frequencylbl = svg.append("text")
    .attr("class", "other label")
    .attr("text-anchor", "start")
    .attr("y", 40)
    .attr("x", width - 300)
    .text(" ");

var first_time = true;

// Load the data.
d3.json("themesbyNpsApi2", function(nations) {

  // A bisector since many nation's data is sparsely-defined.
  var bisect = d3.bisector(function(d) { return d[0]; });
    dragit.time = {min:d3.min(nations, function(d) { return d3.min(d.income, function(e) {return timeConverter(e[0]);})}), 
	max:d3.max(nations, function(d) { return d3.max(d.income, function(e) {return timeConverter(e[0]);})}), 
	step:1, current:d3.min(nations, function(d) { return d3.min(d.income, function(e) {return timeConverter(e[0]);})})}

	
  // Add a dot per nation. Initialize the data at 2006, and set the colors.
  var dot = svg.append("g")
      .attr("class", "dots")
    .selectAll(".dot")
      .data(interpolateData(dragit.time.min))
    .enter().append("circle")
      .attr("class", "dot")
      .style("fill", function(d) { return colorScale(color(d)); })
      .call(position)
      .on("mousedown", function(d, i) {

      })
      .on("mouseup", function(d, i) {
        // dot.classed("selected", false);
        // d3.select(this).classed("selected", !d3.select(this).classed("selected"));
        // dragit.trajectory.display(d, i, "selected");

        //TODO: test if has been dragged
        // Look at the state machine history and find a drag event in it?

      })
      .on("mouseenter", function(d, i) {
        if(dragit.statemachine.current_state == "idle") {
          // dragit.trajectory.display(d, i)
          // dragit.utils.animateTrajectory(dragit.trajectory.display(d, i), dragit.time.current, 1000)
          countrylabel.text(d.name);
          sentimentlbl.text('Sentiment: ' + d.lifeExpectancy);
          frequencylbl.text('Frequency: ' + d.population);
          npsratinglbl.text('NPS Rating: ' + d.income);
          dot.style("opacity", .4)
          d3.select(this).style("opacity", 1)
          d3.selectAll(".selected").style("opacity", 1)
        }
      })
      .on("mouseleave", function(d, i) {

        if(dragit.statemachine.current_state == "idle") {
          countrylabel.text("");
          sentimentlbl.text("");
          frequencylbl.text("");
          npsratinglbl.text("");
          dot.style("opacity", 1);
        }
  
        // dragit.trajectory.remove(d, i);
      })
      // .call(dragit.object.activate)

  // Add a title.
  dot.append("title")
      .text(function(d) { return d.name; });

  // Start a transition that interpolates the data based on year.
  svg.transition()
      .duration(30000)
      .ease("linear")

  // Positions the dots based on data.
  function position(dot) {
    dot.attr("cx", function(d) { return xScale(x(d)); })
       .attr("cy", function(d) { return yScale(y(d)); })
       .attr("r", function(d) {  return radiusScale(radius(d)); });
  }

  // Defines a sort order so that the smallest dots are drawn on top.
  function order(a, b) {
    return radius(b) - radius(a);
  }

  // Updates the display to show the specified year.
  function displayYear(year) {
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    dot.data(interpolateData(year+dragit.time.min), key).call(position);//.sort(order);
    label.text(months[(dragit.time.min + Math.round(year))-1]);
  }

  // Interpolates the dataset for the given (fractional) year.
  function interpolateData(year) {
    return nations.map(function(d) {
      return {
        name: d.name,
        region: d.name,
        income: interpolateValues(d.income, year),
        population: interpolateValues(d.population, year),
        lifeExpectancy: interpolateValues(d.lifeExpectancy, year)
      };
    });
  }

  // Finds (and possibly interpolates) the value for the specified year.
  function interpolateValues(values, year) {
  
  if(values === undefined)
	return 0;
    var i = bisect.left(values, year, 0, values.length - 1),
        a = values[i];
    if (i > 0) {
      var b = values[i - 1],
          t = (year - a[0]) / (b[0] - a[0]);
      return a[1] * (1 - t) + b[1] * t;
    }
    return a[1];
  }
  
  init();

  function update(v, duration) {
  
    dragit.time.current = v || dragit.time.current;
    displayYear(v)
    d3.select("#slider-time").property("value", dragit.time.current);
  }

  function init() {

    dragit.init(".gRoot");
	
    dragit.data = d3.range(nations.length).map(function() { return Array(); })
// console.log(dragit.time);
    for(var yy = dragit.time.min; yy<dragit.time.max; yy++) {
// console.log(yy);
      interpolateData(yy).filter(function(d, i) { 
	  
        dragit.data[i][yy-dragit.time.min] = [xScale(x(d)), yScale(y(d))];

      })
    }

    dragit.evt.register("update", update);

    //d3.select("#slider-time").property("value", dragit.time.current);

    d3.select("#slider-time")
      .on("mousemove", function() { 
        update(parseInt(this.value), 500);
        clear_demo();
      })

    var end_effect = function() {
      countrylabel.text("");
      dot.style("opacity", 1)
    }

    dragit.evt.register("dragend", end_effect)
  }

function clear_demo() {
  if(first_time) {
     svg.transition().duration(0);
    first_time = false;
    window.clearInterval(demo_interval);
    countrylabel.text("");
    dragit.trajectory.removeAll();
    d3.selectAll(".dot").style("opacity", 1)
  }
}

function play_demo() {

  var ex_nations = ["DELIVERY", "ORGANIZATION", "SERVICE", "ORDER", "PRODUCT", "REFUND"]
  var index_random_nation = null;
  var random_index = Math.floor(Math.random() * ex_nations.length);
  var random_nation = nations.filter(function(d, i) { 
    if(d.name == ex_nations[random_index]) {
      index_random_nation = i;
      return true;
    }
  })[0];

//   console.log(random_nation);
  var random_nation = nations[index_random_nation];

  dragit.trajectory.removeAll();
  dragit.trajectory.display(random_nation, index_random_nation);
  countrylabel.text(random_nation.name);

  dragit.utils.animateTrajectory(dragit.lineTrajectory, dragit.time.min, 2000)

  d3.selectAll(".dot").style("opacity", .4)

  d3.selectAll(".dot").filter(function(d) {
    return d.name == random_nation.name;
  }).style("opacity", 1)
}

var demo_interval = null;

setTimeout(function() {
  if(first_time) {
	//   console.log("1");
    // play_demo()
    // demo_interval = setInterval(play_demo, 3000)
  }
}, 1000);

});

});


