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
					case 'PRODUCT': service = response.data.aggregations["0"].results[i].aggregations["0"].aggregations["0"].aggregations["0"].results[j].aggregations["0"].value;
						break;
					case 'EMPLOYEE': employee = response.data.aggregations["0"].results[i].aggregations["0"].aggregations["0"].aggregations["0"].results[j].aggregations["0"].value;
						break;
					case 'SERVICE': product = response.data.aggregations["0"].results[i].aggregations["0"].aggregations["0"].aggregations["0"].results[j].aggregations["0"].value;
						break;
					case 'PRICE': price = response.data.aggregations["0"].results[i].aggregations["0"].aggregations["0"].aggregations["0"].results[j].aggregations["0"].value;
						break;

				}
			}
			brand = response.data.aggregations["0"].results[i].aggregations["0"].aggregations["0"].aggregations["0"].results["0"].aggregations["0"].value;
			var d = new Date(response.data.aggregations["0"].results[i].key_as_string)
		
			dataOfThemesByTime.push({ x: d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate() , brand: brand.toFixed(2), price: price.toFixed(2), product: product.toFixed(2), employee: employee.toFixed(2), service: service.toFixed(2) });
			brand = 0, service = 0, employee = 0, product = 0;
		}
		drawLineGraph('themesByTime', dataOfThemesByTime, ['Brand', 'Price', 'Product', 'Service', 'Employee'], "Time", ['brand', 'price', 'product', 'service', 'employee']);
		$http.get('/themesbygroup').then(function (response) {
			for (var i = 0; i < response.data.aggregations["0"].results.length; i++) {
				var result = response.data.aggregations["0"].results[i].aggregations["0"].aggregations["0"].aggregations["0"].results;
				for (var j = 0; j < result.length; j++) {
					datapoints[result[j].key] = result[j].aggregations["0"].value.toFixed(2);
					console.log(result[j]);
					for (var k = 0; k < result[j].aggregations[1].results.length; k++)
						sentiments[result[j].aggregations[1].results[k].key] = result[j].aggregations[1].results[k].matching_results;
					console.log(sentiments);

					datapoints[count++] = {
						name: result[j].key + ' -> SENTIMENTS : ' + result[j].aggregations["0"].value.toFixed(2),
						colorByPoint: true,
						data: [{ x: sentiments['negative'], y: sentiments['neutral'], z: sentiments['positive'] }]
					}

				}
				graphData[i] = { name: response.data.aggregations["0"].results[i].key, data: [parseFloat(datapoints['ORGANIZATION']), parseFloat(datapoints['SERVICE']), parseFloat(datapoints['PRODUCT']), parseFloat(datapoints['PRICE']), parseFloat(datapoints['EMPLOYEE'])] };

			}
			drawtThemesByGroup(graphData, datapoints);
		});

	});

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
	function drawtThemesByGroup(data, datapoints) {
		Highcharts.chart('themesByGroup', {
			chart: {
				type: 'scatter'
			},
			title: {
				text: 'GROUP AND SENTIMENT'
			},
			yAxis: {
				title: { text: 'Sentiments' }
			},
			xAxis: {
				categories: ['ORGANIZATION', 'SERVICE', 'PRODUCT', 'PRICE', 'EMPLOYEE']
			},
			credits: {
				enabled: false
			},
			series: data
		});


		Highcharts.setOptions({
			colors: $.map(Highcharts.getOptions().colors, function (color) {
				return {
					radialGradient: {
						cx: 0.4,
						cy: 0.3,
						r: 0.5
					},
					stops: [
						[0, color],
						[1, Highcharts.Color(color).brighten(-0.2).get('rgb')]
					]
				};
			})
		});

		// Set up the chart
		var chart = new Highcharts.Chart({
			chart: {
				renderTo: 'container',
				margin: 100,
				type: 'scatter3d',
				options3d: {
					enabled: true,
					alpha: 10,
					beta: 30,
					depth: 250,
					viewDistance: 5,
					fitToPlot: false,
					frame: {
						bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
						back: { size: 1, color: 'rgba(0,0,0,0.04)' },
						side: { size: 1, color: 'rgba(0,0,0,0.06)' }
					}
				}
			},
			title: {
				text: 'SENTMENTS OF DATA POINTS'
			},
			plotOptions: {
				scatter: {
					width: 10,
					height: 10,
					depth: 10
				}
			},
			yAxis: {
				min: 0,
				max: 200,
				title: { text: 'NUTRAL' },
				gridLineWidth: 1
			},
			xAxis: {
				min: 0,
				max: 300,
				title: { text: 'NEGATIVE' },
				gridLineWidth: 1
			},
			zAxis: {
				min: 0,
				max: 200,
				title: { text: 'POSITIVE' },
				gridLineWidth: 1
			},
			legend: {
				enabled: false
			},
			credits: {
				enabled: false
			},
			tooltip: {
				formatter: function () {
					return '<b>'+this.series.name +'</b> <br/>POSITIVE: <b>' + this.point.z + '</b><br/>NEGATIVE: <b>' + this.x + '</b> <br> NUTRAL: <b>' + this.y + '</b>';
				}
			},
			series: datapoints
		});


		// Add mouse events for rotation
		$(chart.container).on('mousedown.hc touchstart.hc', function (eStart) {
			eStart = chart.pointer.normalize(eStart);

			var posX = eStart.chartX,
				posY = eStart.chartY,
				alpha = chart.options.chart.options3d.alpha,
				beta = chart.options.chart.options3d.beta,
				newAlpha,
				newBeta,
				sensitivity = 5; // lower is more sensitive

			$(document).on({
				'mousemove.hc touchmove.hc': function (e) {
					// Run beta
					e = chart.pointer.normalize(e);
					newBeta = beta + (posX - e.chartX) / sensitivity;
					chart.options.chart.options3d.beta = newBeta;

					// Run alpha
					newAlpha = alpha + (e.chartY - posY) / sensitivity;
					chart.options.chart.options3d.alpha = newAlpha;

					chart.redraw(false);
				},
				'mouseup touchend': function () {
					$(document).off('.hc');
				}
			});
		});

	}
});