'use strict';

/* Controllers */

var myAppControllers = angular.module('myApp.controllers', []);

myAppControllers.controller('MyCtrl1',
['$scope','$sails','$filter',
function($scope,$sails,$filter) {
  ///////////
  $scope.items = [];

  $scope.createItem = function(newItem) {
    console.log('createItem '+JSON.stringify(newItem));
    $sails.post("/item",newItem).success(function (response) {
      console.log("post /item success"+response);
      // if we post, we don't get a create message from ourselves,
      // so we add it explicitly 
      $scope.items.push(response);
    }).error(function (response) {
      window.alert('post /item error');
    });
    $scope.newItem = {};
  };
  $scope.createTask = function(item) {
    console.log('createTask '+JSON.stringify(item.newTask));
    item.newTask.owner = item.id;
    $sails.post("/task",item.newTask).success(function (response) {
      console.log("post /task success");
      // if we post, we don't get a addedTo message from ourselves,
      // so we add it explicitly
      item.tasks.push(response);
    }).error(function (response) {
      window.alert('post /task error');
    });
    item.newTask = {};
  };
  $scope.taskEdited = function(task)
  {
    task.edited = 'edited';
  }
  $scope.itemEdited = function(item)
  {
    item.edited = 'edited';
  }
  $scope.updateItem = function(item) {
    delete item.edited;
    $sails.put("/item/"+item.id,item).success(function (response) {
      console.log("put /item success");
    }).error(function (response) {
      console.log('put /item error');
    });
  };
  $scope.updateTask = function(task) {
    delete task.edited;
    $sails.put("/task/"+task.id,task).success(function (response) {
      console.log("put /task success");
    }).error(function (response) {
      window.alert('put /task error');
    });
  };

  $scope.getItemById = function(id) {
    for (var i in $scope.items)
    {
      if ($scope.items[i].id == id)
      {
        return $scope.items[i];
      }
    }
    return null;
  };

  $scope.setItemById = function(id,data) {
    for (var i in $scope.items)
    {
      if ($scope.items[i].id == id)
      {
        $scope.items[i] = data;
        return;
      }
    }
  };
   
  $scope.getTaskById = function(id) {
    for (var ii in $scope.items)
    {
      for (var ti in $scope.items[ii].tasks)
      {
        if ($scope.items[ii].tasks[ti].id == id)
        {
          return $scope.items[ii].tasks[ti];
        }
      }
    }
    return null;
  };

  $scope.setTaskById = function(id,data) {
    for (var ii in $scope.items)
    {
      for (var ti in $scope.items[ii].tasks)
      {
        if ($scope.items[ii].tasks[ti].id == id)
        {
          $scope.items[ii].tasks[ti] = data;
          return;
        }
      }
    }
  };
 
  (function() {
    $sails.get("/item").success(function (response) {
      $scope.items = response; 
    }).error(function (response) { console.log('error');});
    
    $sails.get("/task").success(function (response) {
      console.log('task: '+response);
    }).error(function (response) { console.log('error');});

    $sails.on('item', function ( message ) {
      console.log('sails published a message for item: '+message.verb);
      switch (message.verb)
      {
        case 'updated':
          $scope.setItemById(message.id,message.data);
          break;
        case 'created':
          console.log("pushing "+JSON.stringify(message.data));
          $scope.items.push(message.data);
          break;
        case 'destroyed':
          $scope.items = $scope.items.filter(function(item) {
            return item.id != message.id;
          });
          break;
        case 'addedTo':
          var item = $scope.getItemById(message.id);
          if (item != null)
          {
            $sails.get("/task/"+message.addedId).success(function (aTask) {
              item.tasks.push(aTask);
            }).error(function (aTask) { window.alert('error getting added task');});
          }
          break;
        case 'removedFrom':
          var item = $scope.getItemById(message.id);
          if (item != null)
          {
            item.tasks = item.tasks.filter(function(task) {
              return task.id != message.removedId;
            });
          }
          break;
      }
    });
    $sails.on('task', function ( message ) {
      console.log('sails published a message for task: '+message.verb);
      switch (message.verb)
      {
        case 'updated':
          $scope.setTaskById(message.id,message.data);
          break;
      }
    });

  })();
  ///////////

  }]);

myAppControllers.controller('MyCtrl2', [function() {
}]);

