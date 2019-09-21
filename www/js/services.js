angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('webService', function($http, $q) {
  return {
    get: function(base) {
      var deferred = $q.defer();
      $http({
        method: "GET",
        url: base
      })
	  .then(function(res) {		//success
        console.log(res);
        deferred.resolve(res.data);
      }, function(res) {		//failure
        console.log(res);
        deferred.reject(res.data);
      }, function(res) {		//notification
        console.log(res);
        deferred.notify(res.data);
      })
	  .catch(function(res){		//failure
		console.log(res);  
	  })
	  .finally(function(res){	//always
		//console.log(res);
	  });
      return deferred.promise;
    }
  };
})

;
