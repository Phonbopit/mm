var app = angular.module('firstApp', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {

	$routeProvider
		.when('/', {
			templateUrl: 'views/page/home.html',
			controller: 'homeController',
			controllerAs: 'home'
		})
		.when('/about', {
			tempalteUrl: 'views/page/about.html',
			controller: 'aboutController',
			controllerAs: 'about'
		})
		.when('/contact', {
			templateUrl: 'views/page/contact.html',
			controller: 'contactController',
			controllerAs: 'contact'
		});

	// Setup pretty URLs
	$locationProvider.html5Mode(true);
});