'use strict';

/* Controllers */

var myAppControllers = angular.module('myApp.controllers', []);

myAppControllers.controller('MyCtrl1',
['$scope','$sails','$filter',
function($scope,$sails,$filter) {
  ///////////
  $scope.lookup = {};
  $scope.items = [];

  (function() {
    $sails.get("/item").success(function (response) {
      $scope.items = response; 
      $scope.lookup = {};
      for (var i in $scope.items)
      {
        $scope.lookup[$scope.items[i].id] = i;
        console.log(  $scope.lookup[$scope.items[i].id] );
      }
    }).error(function (response) { console.log('error');});
    
    $sails.get("/task").success(function (response) {
      console.log('task: '+response);
    }).error(function (response) { console.log('error');});

    $sails.on('item', function ( message ) {
      console.log('sails published a message for item: '+message.verb);
      switch (message.verb)
      {
        case 'created':
          console.log("pushing "+JSON.stringify(message.data));
          $scope.items.push(message.data);
          $scope.lookup = {};
          for (var i in $scope.items)
          {
            $scope.lookup[$scope.items[i].id] = i;
          }
          break;
        case 'destroyed':
          $scope.items = $scope.items.filter(function(item) {
            return item.id != message.id;
          });
          $scope.lookup = {};
          for (var i in $scope.items)
          {
            $scope.lookup[$scope.items[i].id] = i;
          }
          break;
        case 'addedTo':
          var idx = $scope.lookup[message.id];
          $sails.get("/task/"+message.addedId).success(function (aTask) {
            $scope.items[idx].tasks.push(aTask);
          }).error(function (aTask) { console.log('error');});
          break;
        case 'removedFrom':
          var idx = $scope.lookup[message.id];
          $scope.items[idx].tasks = $scope.items[idx].tasks.filter(function(task) {
            return task.id != message.removedId;
          });
          break;
      }
    });
    $sails.on('task', function ( message ) {
      console.log('sails published a message for task: '+message.verb);
    });

  })();
  ///////////

  }]);

myAppControllers.controller('MyCtrl2', [function() {
}]);

