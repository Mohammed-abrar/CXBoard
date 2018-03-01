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

app.controller('themes', function ($scope, $http) {
	var dataOfThemesByTime = [];
	var brand = [];
	var employee = [];
	var product = [];
	var price = [];
	var org = [];

	var timeVSsentiment = [];
	$http.get('/themesbytime').then(function (response) {
		for (var i = 0; i < response.data.aggregations["0"].results.length; i++) {
			dataOfThemesByTime.push({ x: response.data.aggregations["0"].results[i].key_as_string, y: response.data.aggregations["0"].results[i].aggregations["0"].aggregations["0"].aggregations["0"].results["0"].aggregations["0"].value });
		}
		drawLineGraph('themesbytime', dataOfThemesByTime, ['breakdown'], "Time", 'y');



		for (var i = 0; i < response.data.results.length; i++) {
			console.log(response.data.results[i]);

			if (response.data.results[i].brand) {
				brand.push({ "time": response.data.results[i].time, brand: response.data.results[i].enriched_text.sentiment.document.score });
				timeVSsentiment.push({ x: response.data.results[i].time, y: response.data.results[i].enriched_text.sentiment.document.score, a: response.data.results[i].enriched_text.entities["0"].sentiment.score });
			}

			for (var j = 0; j <response.data.results[i].enriched_text.entities.length; j++) {
				if (response.data.results[i].enriched_text.entities["0"].type == "EMPLOYEE") {
					employee.push(response.data.results[i].enriched_text.entities[j].sentiment.score)

				}
				if (response.data.results[i].enriched_text.entities["1"].type == "EMPLOYEE") {
					employee.push(response.data.results[i].enriched_text.entities[j].sentiment.score)

				}
				// if (response.data.results[i].enriched_text.entities[j].type == "ORGANIZATION") {
				// 	org.push(response.data.results[i].enriched_text.entities[j].sentiment.score)

				// }

				// if (response.data.results[i].enriched_text.entities[j].type == "PRICE") {
				// 	price.push(response.data.results[i].enriched_text.entities[j].sentiment.score)

				// }
			}




		}
		console.log(timeVSsentiment);
		console.log("________________BRAND____________________");
		console.log(brand);
		console.log("________________EMPLOYEE____________________");
		console.log(employee);
		console.log("________________PRICE____________________");
		console.log(price);
		console.log("________________ORGANIZATION____________________");
		console.log(org);
		drawLineGraph('series', timeVSsentiment, ['Brand', 'Employee'], "Time", ['y', 'a']);

	});
});

function drawLineGraph(elementname, data, labels, xLabels, yKeys) {
	Morris.Line({
		element: elementname,
		data: data,
		xkey: 'x',
		ykeys: yKeys,
		lineColors: ['#0ec888', 'red'],
		labels: labels,
		lineWidth: 7,
		xLabels: xLabels
	});
}