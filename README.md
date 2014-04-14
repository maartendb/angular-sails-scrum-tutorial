# Sails.js + Angular.js tutorial

This tutorial shows how to write a web app with Sails.js and AngularJS, using socket.io for realtime updates between the Sails.js backend and the AngularJS frontend. 

The code of this tutorial is in github at https://github.com/maartendb/angular-sails-scrum-tutorial .

[Sails.js](http://sailsjs.org/) is a [Node.js](http://nodejs.org) MVC framework for developing realtime web apps. It automatically generates a RESTful JSON API.

[AngularJS](angularjs.org/) is a javascript library that allows you to enhance HTML with custom tags for rich interaction between your HTML code and javascript variables.

I started using Node.js only recently and tried several examples and went through some tutorials myself, with varying degrees of success. There are many different ways to do things, many tools to choose from and things seem to change quite rapidly. In any case, I tried to stay as close to the sails.js project as it installs out of the box, as well as to the recommended angular-seed skeleton app. That said, I am very open for suggestions.

This tutorial assumes you have Node.js installed and some experience with it and that you know what sails.js and AngularJS are about, but otherwise it is a step-by-step guide so you should be able to follow it without prior knowledge.

## Setting up your sails.js project

I am using the latest version of sails.js, which is the 0.10.0-rc5 at the time of writing. There are several important changes from older versions.

As an example, we will build a very rudimentary scrum sprint backlog tool. The sprint backlog consists of items, which are stories writing in the form of a sentence *"As a **role** I want a **feature***", and each item will consist of several tasks, that can be assigned to people. We setup the sails.js project accordingly. 

```
$ sudo npm -g install sails@0.10.0-rc5
$ sails new scrum
$ cd scrum
$ sails generate api item
$ sails generate api task
```

Sails.js has generated empty files for our item and task data models, so let's complete them for our goal.

### api/model/task.js
 
```javascript
module.exports = {
  schema: true,
  attributes: {
    title: {
      type: 'string',
      required: true
    },
    assignee: {
      type: 'string',
      required: false
    },
    owner:{
      model: 'item'
    }
  }
};
```

### api/model/item.js

```javascript
module.exports = {
  schema: true,
  attributes: {
    role: {
      type: 'string',
      required: true
    },
    feature: {
      type: 'string',
      required: true
    },
    status: {
      type: 'string',
      defaultsTo: ''
    },
    tasks:{
      collection: 'task',
      via: 'owner'
    }
  }
};
```

Note how the relation between the item and the task model is specified with the **task**'s **owner** and the **item**'s **tasks** attributes.

That's all we need to setup for now.

## Running the sails.js app

We can now run our scrum app sails.js backend.

```
$ sails lift
```

You can access the backend here at http://localhost:1337 and see the data  at http://localhost:1337/item and http://localhost:1337/task with sails.js RESTful API, which for now return empty arrays. Let's add some data. Create an item with 

http://localhost:1337/item/create?role=developer&feature=to+learn+sails.js+and+angular

returns:
```
{
  "role": "developer",
  "feature": "to learn sails.js and angular",
  "status": "",
  "createdAt": "2014-04-12T21:04:36.653Z",
  "updatedAt": "2014-04-12T21:04:36.653Z",
  "id": 1
}
```

and create a task, which belongs to this item, so we pass the **item**'s id as the **tasks**'s owner:

http://localhost:1337/task/create?title=follow+a+tutorial&owner=1

returns:
```
{
  "title": "follow a tutorial",
  "owner": 1,
  "createdAt": "2014-04-12T21:06:21.367Z",
  "updatedAt": "2014-04-12T21:06:21.367Z",
  "id": 1
}
```

If you visit the item at http://localhost:1337/item/1 you will see how sails.js automatically populates the tasks attribute.

Add some more items and tasks and revisit the http://localhost:1337/item and http://localhost:1337/task to make sure everything is working as expected. This might be a good point to get familiar with the sails.js RESTful API, and see how you can update or destroy data.

## Adding an AngularJS frontend

We are now going to add a web frontend to visualize and access the data with AngularJS.

AngularJS provides an application skeleton to quickly bootstrap your AngularJS webapp projects, available at https://github.com/angular/angular-seed .

You could get angular-seed with git, but since I had my own code in git and didn't want to deal with git submodules, I just used the Download ZIP option.

Still inside my scrum project directory, I unzip the file and rename the extracted directory to angular. 
```
$ unzip ~/Downloads/angular-seed-master.zip
$ mv angular-seed-master angular
```

You can now install the required node.js components and start an http server to make sure that everything is working as expected:

```
$ cd angular
$ npm install
$ npm start
```

The AngularJS skeleton app is now accessible at http://localhost:8000/app/ .

It is however very convenient to run our AngularJS app from sails.js, and it will make the communication between the two easier. Sails.js uses Express, so we can easily serve the angular folder as static files. There are many other ways, but I found this was by far the easiest.

Go back to your sails.js project folder and edit **config/express.js**

```javascript
module.exports.express = {

  customMiddleware: function (app) {
    console.log(__dirname);
    var express = require('../node_modules/sails/node_modules/express');
    app.use('/angular',express.static(__dirname+"/../angular"));
  }
  ....
```

Restart sails.js with ```sails lift``` and you can now access the AngularJS skeleton app at http://localhost:1337/angular/app/ .


## Accessing the Sails.js API from AngularJS

In order to access our item and task data with the Sails.js generated RESTful API from AngularJS, we are going to use a **angular-sails**, a small module that allows you to use Sails.js socket.io api with AngularJS. Go to the angular folder

```
$ cd angular
```

and add the dependency to **bower.json**

```
"angular-sails": "https://github.com/kyjan/angular-sails.git"
```

and install it

```
$ bower install
```


**FROM HERE ON THIS TUTORIAL NEEDS MORE EXPLANATION**

Add to **app/index.html**

```html
  <script src="../bower_components/angular/angular.js"></script>
  <script src="../bower_components/angular-route/angular-route.js"></script>
  <!--  ADDED FOR SAILS.JS -->
  <script src="/js/dependencies/sails.io.js"></script>
  <script src="../bower_components/angular-sails/dist/angular-sails.js"></script>
  <!------------------------->
  <script src="js/app.js"></script>
  <script src="js/services.js"></script>
  <script src="js/controllers.js"></script>
  <script src="js/filters.js"></script>
  <script src="js/directives.js"></script>
```

Add to **app/partials/partial1.html**

```html
<ul>
  <li ng-repeat="item in items">
    {{item.role}} | {{item.feature}}
    <ul>
      <li ng-repeat="task in item.tasks">
      {{task.title}} {{task.assignee}}
      </li>
    </ul>
  </li>
</ul>
```

Add angular-sails module dependency **ngSails** to the AngularJS app, in **app/js/app.js**

```javascript
  'ngRoute',
  'ngSails', // angular-sails
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
```

Modify **js/controllers.js** to use sails and fill $scope.items from sails.

**TODO** Add several versions of this file with increasing functionality. Start with just the get("/item") part.

```javascript
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
```

In **config/blueprints.js**, you will need to set autoWatch to true, in order to get **create** messages from the socket.io. (This is not recommended, but for this tutorial it's ok)

```javascript
  autoWatch: true
```

If you reload http://localhost:1337/angular/app/ , you should now see a nested list with the items and their tasks. When you create, destroy or update items or tasks with the sails.js RESTful, you should see the changes reflected in realtime in the angular app.

**The result of the tutorial until here is in branch showdata**

## TODO

 * Add more explanation and details to the last part
 * Include a list of other tutorials and documentation I found useful
 * The code in branch **forms** expands on the above by adding forms
   to create new tasks and items and add them to sails.js with post calls.
   Write another tutorial. 
 * The code in branch **updateforms** expands on that by adding forms to
   change tasks and items values and update sails.js with put calls. Write
   another tutorial.
 * Explain how to make the angular app the homepage with a copy task
 * Add buttons to remove items and tasks
 * Use angular-ui-tree to put all of the above a draggable tree
