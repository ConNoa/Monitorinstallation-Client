'use strict';

/* Controllers */

angular.module('configApp')
.controller('configCtrl', ['$rootScope', '$scope', '$location', '$modal', '$stateParams', 'vvvv', 'pollingService',  function( $rootScope, $scope, $location, $modal, $stateParams, vvvv, pollingService) {
    $scope.path = $stateParams.path;
	$scope.delete = function(path){
        vvvv.deleteGroup({path: $stateParams.path}, function(data){
            var e = document.getElementById('sideBar');
            var scope = angular.element(e).scope();
            // update the model with a wrap in $apply(fn) which will refresh the view for us
            scope.$evalAsync(function() {
                scope.refresh();
                $rootScope.$state.go('index');
            }); 
        });
    };
	
    vvvv.getconfig(function(data){
        $scope.data = data.Data[$stateParams.path];
        //console.log("data: " + data.Data[$stateParams.path]);
    });

	$scope.print = function(message){
		console.log(typeof message);
		console.log(message);
	};
	
	$scope.changeSpread = function(spread, value, id, type){
		spread = spread + '';
		var arrStr = spread.split(',');
		if (type === 'values') {
			arrStr[id] = value;
			var arrInt = arrStr.map(Number);
			spread = arrInt;
		}
		
		if (type === 'strings') {
			if (value.indexOf(',')>-1){
				value = value.replace(/,/g,'');
				alert("Warning! Commas are not allowed");
			}
			arrStr[id] = value;
			spread = arrStr;
		}
		
		return spread;
	};
	
	$scope.compare = function(newValues, oldValues) {
		newValues = newValues + '';
		oldValues = oldValues + '';
		return newValues==oldValues;
	};	
	
	$scope.checkLength = function(type, admin){
		var check;
		if ($scope.data == null) {
			check = false;
		} else {
			if (admin) {
				check = true;
			} else {
				if (type === 'toggles') {
					
					if (Object.keys($scope.data.Toggles).length > 0) {
						check = true;
					} else {
						check = false;
					}
				}
				if (type === 'values') {
					
					if (Object.keys($scope.data.Values).length > 0) {
						check = true;
					} else {
						check = false;
					}
				}
				if (type === 'strings') {
					
					if (Object.keys($scope.data.Strings).length > 0) {
						check = true;
					} else {
						check = false;
					}
				}
			}
		}
		return check;
			
	};
	
    $scope.Save = function(value, name, type){
		value = value + '';
		var arr = value.split(',');
		if (arr.length > 10) {
			arr = arr.slice(0,10);
			alert("Warning! The limit of elements is 10. Elements outside the limit will be eliminated");
		}
		value = arr.join(',');
		var data = {
            value: value,
            name: name,
            type: type,
            path: $stateParams.path

        };

        vvvv.setvalue(data, function(data){
            $scope.data = data.Data[$stateParams.path];
        });
    };

    $scope.Delete = function(name, type){
        var data = {
            name: name,
            type: type,
            path: $stateParams.path
        };

        vvvv.deletevalue(data, function(data){
            $scope.data = data.Data[$stateParams.path];
        });
    };

    $scope.addValue = function(type) {
		if (type === 'toggle')
            var modalInstance = $modal.open({
                templateUrl: 'views/addToggle.html',
                controller: 'ModalInstanceCtrl',
                resolve: {
                    newtype: function () {
                        return 'toggle';
                    },
                    path: function() {
                        return $stateParams.path;
                    }
                }
            });
        if (type === 'value')
            var modalInstance = $modal.open({
                templateUrl: 'views/addValue.html',
                controller: 'ModalInstanceCtrl',
                resolve: {
                    newtype: function () {
                        return 'value';
                    },
                    path: function() {
                        return $stateParams.path;
                    }
                }
            });
        if (type === 'string')
            var modalInstance = $modal.open({
                templateUrl: 'views/addString.html',
                controller: 'ModalInstanceCtrl',
                resolve: {
                    newtype: function () {
                        return 'string';
                    },
                    path: function() {
                        return $stateParams.path;
                    }
                }
            });
        if (type === 'color')
            var modalInstance = $modal.open({
                templateUrl: 'views/addColor.html',
                controller: 'ModalInstanceCtrl',
                resolve: {
                    newtype: function () {
                        return 'color';
                    },
                    path: function() {
                        return $stateParams.path;
                    }
                }
            });

        modalInstance.result.then(function (data) {
            vvvv.setvalue(data, function(data){
                $scope.data = data.Data[$stateParams.path];
        });
        });
    };      

}]);

angular.module('configApp')
.controller('sideCtrl', ['$rootScope', '$scope', '$location', '$modal', 'vvvv', 'pollingService',  function( $rootScope, $scope, $location, $modal, vvvv, pollingService) {
    
    $scope.showAdd = function(){
        var modalInstance = $modal.open({
                templateUrl: 'views/addGroup.html',
                controller: 'ModalInstanceGroupCtrl',
                
            });

        modalInstance.result.then(function (data) {
             vvvv.crerateGroup(data, function(data){
                 Data2Keys(data);
         });
        });

    };

    $scope.refresh = function(){
    vvvv.getconfig(function(data){
        Data2Keys(data);
    });};

    $scope.refresh();

    function Data2Keys(data){
        var keys = [];
        angular.forEach(data.Data, function(value, key) {
            keys.push(key);
        });
        $scope.keys = keys;
    }

}]);

angular.module('configApp')
.controller('computerCtrl', ['$rootScope', '$scope', '$location', 'vvvv',  function( $rootScope, $scope, $location, vvvv) {

    $scope.doCommand = function(command){
        var data = {
            command: command
        };

        vvvv.execCommand(data);
    };

}]);

angular.module('configApp')
.controller('dashboardCtrl', ['$rootScope', '$scope', 'pollingService', function($rootScope, $scope, pollingService){
    pollingService.startPolling('debug', '/api/debuginfo', 1000, function(data){
    });

    $scope.$on('$destroy', function(){
        pollingService.stopPolling('debug');
    });
    
    $scope.$watch(function () { if(pollingService.pdata.debug) return pollingService.pdata.debug }, function (newVal, oldVal) {
    if (typeof newVal !== 'undefined') {
        $scope.debuginfo = pollingService.pdata.debug;
    }
});

}])

angular.module('configApp')
.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'vvvv', 'newtype', 'path', function($scope, $modalInstance, vvvv, newtype, path){
    $scope.ok = function() {
		var value = $scope.newvalue + '';
		var arr = value.split(',');
		if (arr.length > 10) {
			arr = arr.slice(0,10);
			alert("Warning! The limit of elements is 10. Elements outside the limit will be eliminated");
		}
		value = arr.join(',');
		var data = {
			name: $scope.newname,
			type: newtype,
			value: value,
			path: path
        };

        $modalInstance.close(data);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}])

angular.module('configApp')
.controller('ModalInstanceGroupCtrl', ['$scope', '$modalInstance', 'vvvv', function($scope, $modalInstance, vvvv){
    $scope.ok = function() {
       var data = {
            name: $scope.newname,
        };

        $modalInstance.close(data);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}])

angular.module('configApp')
.controller('chartJsDoughnutCtrl', ['$rootScope', '$scope', 'pollingService', function($rootScope, $scope, pollingService) {
    // Chart.js Data
    $scope.$watch(function () {
        if(pollingService.pdata.debug)
            return pollingService.pdata.debug
        },
        function (newVal, oldVal) {
            if (typeof newVal !== 'undefined') {
                $scope.data = [
                    {value: pollingService.pdata.debug.umemory,
                    color: "#1ABC9C",
                    highlight: "#1ABC9C",
                    label: "Used"}, 

                    {value: pollingService.pdata.debug.fmemory,
                    color: "#556B8D",
                    highlight: "#556B8D",
                    label: "Free"}
                ];


            }
        }
    );
    // Chart.js Options
    $scope.options = {

        // Sets the chart to be responsive
        responsive: true,

        //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke: true,

        //String - The colour of each segment stroke
        segmentStrokeColor: '#fff',

        //Number - The width of each segment stroke
        segmentStrokeWidth: 2,

        //Number - The percentage of the chart that we cut out of the middle
        percentageInnerCutout: 50, // This is 0 for Pie charts

        //Number - Amount of animation steps
        animationSteps: 1,

        //String - Animation easing effect
        animationEasing: 'easeOutBounce',

        //Boolean - Whether we animate the rotation of the Doughnut
        animateRotate: false,

        //Boolean - Whether we animate scaling the Doughnut from the centre
        animateScale: false,

        //String - A legend template
        legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'
    };
}])

angular.module('configApp')
.controller('chartJsLineCtrl', ['$rootScope', '$scope', 'pollingService', function($rootScope, $scope, pollingService) {
    // Chart.js Data
    $scope.$watch(function () {
    if(pollingService.pdata.debug)
        return pollingService.pdata.debug
    },
    function (newVal, oldVal) {
        if (typeof newVal !== 'undefined') {
            $scope.data = {
                labels: ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
                datasets: [{
                    //label: 'FPS',
                    fillColor: 'rgba(26,188,156,0.5)',
                    strokeColor: 'rgba(26,188,156,1)',
                    pointColor: 'rgba(220,220,220,1)',
                    pointStrokeColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(220,220,220,1)',
                    data: pollingService.pdata.debug.fpsqueue
                }]
            };
        }
    });

    // Chart.js Options
    $scope.options = {
        animation: false,
        scaleOverride: true,
        scaleSteps: 12,
        // Number - The value jump in the hard coded scale
        scaleStepWidth: 10,
        // Number - The scale starting value
        scaleStartValue: 0,
        
        scaleBeginAtZero : true,
        // Sets the chart to be responsive
        responsive: true,

        ///Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: true,

        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth: 1,

        //Boolean - Whether the line is curved between points
        bezierCurve: true,

        //Number - Tension of the bezier curve between points
        bezierCurveTension: 0.4,

        //Boolean - Whether to show a dot for each point
        pointDot: true,

        //Number - Radius of each point dot in pixels
        pointDotRadius: 4,

        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth: 1,

        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius: 5,

        //Boolean - Whether to show a stroke for datasets
        datasetStroke: true,

        //Number - Pixel width of dataset stroke
        datasetStrokeWidth: 2,

        //Boolean - Whether to fill the dataset with a colour
        datasetFill: true,

        // Function - on animation progress
        onAnimationProgress: function() {},

        // Function - on animation complete
        onAnimationComplete: function() {}

        //String - A legend template
        //legendTemplate: ""
        // legendTemplate: ""'<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
    };

}]);

