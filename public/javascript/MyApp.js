app.config(function($routeProvider) {
			$routeProvider
			.when("/", {
				templateUrl : "/views/home.html",
			})
			.when("/messages", {
				templateUrl : "/views/messages.html",
			})
			.when("/themes", {
				templateUrl : "/views/themes.html",
				controller : "themes"
			})
			.when("/journeys", {
				templateUrl : "/views/journeys.html",
			})
			.when("/stories", {
				templateUrl : "/views/stories.html",
			})
			.when("/stream", {
				templateUrl : "/views/stream.html",
			});
	});

app.controller('themes', function($scope,$http) {	
	var dataOfThemesByTime = [];
		$http.get('/themesbytime').then(function(response){	
			for(var i = 0 ; i < response.data.aggregations["0"].results.length ; i++)
			{
				dataOfThemesByTime.push({x: response.data.aggregations["0"].results[i].key_as_string , y: response.data.aggregations["0"].results[i].aggregations["0"].aggregations["0"].aggregations["0"].results["0"].aggregations["0"].value});
				console.log(response.data.aggregations["0"].results[i].key_as_string);
				console.log(response.data.aggregations["0"].results[i].aggregations["0"].aggregations["0"].aggregations["0"].results["0"].aggregations["0"].value);
			}	
			drawLineGraph('themesbytime',dataOfThemesByTime,['breakdown'],"Time");
	});
});

function drawLineGraph(elementname, data, labels, xLabels){
	Morris.Line({
		element: elementname,
		data: data,
		xkey: 'x',
		ykeys: 'y',
		lineColors: ['#0ec888'],
		labels: labels,
		lineWidth : 7,
		xLabels: xLabels
	  });
}