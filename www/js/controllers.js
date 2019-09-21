angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('navCtrl', function($scope, $ionicPlatform, $cordovaGeolocation, config, webService) {
	$scope.temperature = "";
	$scope.forecast = "";
	$scope.position;
	
	$scope.showForecast = true;
	$scope.radioON = false;
	
	$scope.areaName = "";
	$scope.stationName = "";
	
	
	$scope.switchWeather = function() {
		$scope.showForecast = !$scope.showForecast;
	}
	
	$scope.switchRadio = function() {
		
		$scope.radioON = !$scope.radioON;
		if($scope.radioON)
		{
			document.getElementById('player').play();
			document.getElementById('player').style.color = "blue";
		}
		else
		{
			document.getElementById('player').pause();
			document.getElementById('player').style.color = "#ff0000";
		}
	}
	
    function getGPS() {
		$ionicPlatform.ready(function() {
			var posOptions = {timeout: 30000, enableHighAccuracy: false};
			$cordovaGeolocation
			.getCurrentPosition(posOptions)
			.then(function (position) {          
				$scope.position = position;
				console.log($scope.position);
				
				webService.get(config.weatherUrl+getDateTime()).then(function(res){
					getWeather(res);
				});
				
				webService.get(config.temperatureUrl+getDateTime()).then(function(res){
					getTemperature(res);
				});
			
			}, function(err) {
				// error
				//alert('error');
			});
		})
    }
	
	function getArea(position, areaData) {
		var distance = [];
		var temp = 0;
		areaData.forEach(function(area) {
			temp = Math.abs(position.latitude - area.label_location.latitude) + Math.abs(position.longitude - area.label_location.longitude);
			distance.push(temp);
		})
		temp = distance[0];
		distance.forEach(function(d) {
			if(d < temp)
				temp = d;
		})
		angular.forEach(distance, function(d, i) {
			if(d == temp)
				$scope.areaName = areaData[i].name
		})
	}
	
	function getStation(position, stationData) {
		var distance = [];
		var temp = 0;
		stationData.forEach(function(station) {
			temp = Math.abs(position.latitude - station.location.latitude) + Math.abs(position.longitude - station.location.longitude);
			distance.push(temp);
		})
		temp = distance[0];
		distance.forEach(function(d) {
			if(d < temp)
				temp = d;
		})
		angular.forEach(distance, function(d, i) {
			if(d == temp)
				$scope.stationName = stationData[i].id;
		})
	}
	
	function getDateTime() {
		var today = new Date();
		var temp = today.toISOString();
		temp = temp.slice(0, -5);
		return temp;
	}
	
	function getWeather(data) {
		var forecasts = data.items[0].forecasts;
		getArea($scope.position.coords, data.area_metadata);
		console.log($scope.areaName);
		forecasts.forEach(function(forecast) {
			//console.log(forecast);
			if(forecast.area == $scope.areaName)
			{
				//console.log(forecast.forecast);
				$scope.forecast = forecast.forecast;
			}
		})
	}
	
	function getTemperature(data) {
		var readings = data.items[0].readings;
		getStation($scope.position.coords, data.metadata.stations);
		console.log($scope.stationName);
		readings.forEach(function(reading) {
			//console.log(forecast);
			if(reading.station_id == $scope.stationName)
			{
				//console.log(forecast.forecast);
				$scope.temperature = reading.value;
			}
		})
	}
	
	getGPS()

})

;
