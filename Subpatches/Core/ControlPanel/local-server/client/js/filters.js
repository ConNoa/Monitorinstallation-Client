'use strict';

angular.module('configApp').filter('valueSeparator', function() {
	return function(input) {
		input = input + '';
		var arr = input.split(',');
		var arrInt = arr.map(Number);
		arr = arrInt;
		if (arr.length > 10) {
			return arr.slice(0,10);
		} else {
			return arr;
		}

	};
});

angular.module('configApp').filter('stringSeparator', function() {
	return function(input) {
		input = input + '';
		var arr = input.split(',');
		return arr;
	};
});