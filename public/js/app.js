var app = angular.module('firstApp', []);

app.controller('mainController', function() {

	var vm = this;

	vm.message = 'Hey there! Come and see how good I look!';

	vm.computers = [
		{ name: 'Macbook Pro', color: 'Silver', nerdness: 7 },
		{ name: 'Yoga 2 Pro', color: 'Gray', nerdness: 6 },
		{ name: 'Chromebook', color: 'Black', nerdness: 5 }
	];

});


// How to Angular.js work.
// 1. Create main module called `firstApp`
// 2. Create controller called `mainController`
// 3. Using vm is stands for view control following by John Papa's suggestion.
// 4. Create variables called `message` and list of items called `computers`