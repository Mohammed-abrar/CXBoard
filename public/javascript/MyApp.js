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

app.controller('mycontroller', function($scope,$http) {	

});