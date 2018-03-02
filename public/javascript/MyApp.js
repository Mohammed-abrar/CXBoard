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
			dataOfThemesByTime.push({ x: response.data.aggregations["0"].results[i].key_as_string, brand: brand.toFixed(2),price : price.toFixed(2), product: product.toFixed(2), employee: employee.toFixed(2), service: service.toFixed(2) });
			brand = 0 , service = 0 ,employee = 0, product = 0;
		}
		drawLineGraph('themesByTime', dataOfThemesByTime, ['Brand', 'Price', 'Product', 'Service' , 'Employee' ], "Time", ['brand', 'price', 'product', 'service', 'employee' ]);
	});
});

function drawLineGraph(elementname, data, labels, xLabels, yKeys) {
	Morris.Line({
		element: elementname,
		data: data,
		xkey: 'x',
		ykeys: yKeys,
		lineColors: ['#0c4cb2', '#ed8610','#edda0f', '#0ac933', '#890ac9'],
		labels: labels,
		lineWidth: 7,
		xLabels: xLabels
	});
}