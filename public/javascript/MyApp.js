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
		console.log($scope.datapoints);
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
});


