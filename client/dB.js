var dB = angular.module('dB',['ngRoute','3']);

dB.config(function($routeProvider){
	$routeProvider
		.when('/',{
			templateUrl: "partials/logAndReg.html"
		})
		.when('/dashboard',{
			templateUrl: "partials/dashboard.html"
		})
		.when('/topic/:id',{
			templateUrl: "partials/topic.html"
		})
		.when('/user/:id',{
			templateUrl: "partials/user.html"
		});	
});	

dB.factory('logAndRegFactory',function($http){
	var factory = {};
	factory.addUser = function(user,callback){
		$http.post('/users/new',user).success(function(errors){
			if(errors){
				callback(errors); 
			} else {
				callback();
			}
		});
	};

	factory.login = function(user,callback){
		$http.post('/users/login',user).success(function(output){
			if(output.logged_in){
				callback(true,output.user);
			} else {
				callback(false,output.error);
			}
		});
	};

	return factory;
});

dB.factory('dashboardFactory',function($http){

	var factory = {};

	factory.getTopics = function(callback){
		$http.get('dashboard/topics').success(function(data){
			callback(data);
		});
	};

	factory.addTopic = function(post,user,callback){
		$http.post('dashboard/topic/new',{post: post,user: user}).success(function(data){
			callback(data);
		});
	};

	return factory;

});

dB.factory('topicFactory',function($http){

	var factory = {};

	factory.getTopic = function(id,callback){
		$http.post('/topic',{id: id}).success(function(data){
			callback(data);
		});
	};

	factory.addMessage = function(info,id,user,callback){
		$http.post('/topic/message/new',{message: info.message, id: id, user: user}).success(function(data){
			callback(data);
		});
	};

	factory.addComment = function(info,user,callback){
		$http.post('/topic/comment/new',{info: info, user: user}).success(function(data){
			callback(data);
		});
	};

	return factory;
});

dB.factory('userFactory',function($http){
	var factory = {};

	factory.getUserInfo = function(username,callback){
		$http.get('/user/' + username).success(function(data){
			callback(data);
		});
	};

	return factory;
});

dB.controller('logAndRegController',function($scope, logAndRegFactory, localStorageService, $location){

	if(localStorageService.get('user')){
		$location.path('/dashboard');
	}

	$scope.addUser = function(){
		logAndRegFactory.addUser($scope.newUser,function(errors){
			if(errors){
				$scope.errors = {};
				if(errors.name){
					$scope.errors.name = errors.name;
					$scope.newUser.name = "";
				}

				if(errors.username){
					$scope.errors.username = errors.username;
					$scope.newUser.username = "";
				}

				if(errors.email){
					$scope.errors.email = errors.email;
					$scope.newUser.email = "";
				}

				if(errors.password){
					$scope.errors.password = errors.password;
					$scope.newUser.password = "";
					$scope.newUser.confirm = "";
				}

				if(errors.confirm){
					$scope.errors.confirm = errors.confirm;
					$scope.newUser.password = "";
					$scope.newUser.confirm = "";
				}

				if(errors.usernameTaken){
					$scope.errors.usernameTaken = errors.usernameTaken;
					$scope.newUser.username = "";
				}

				if(errors.emailTaken){
					$scope.errors.emailTaken = errors.emailTaken;
					$scope.newUser.email = '';
				}

			} else {
				console.log("Successfully added a new user");
				$scope.errors = {};
				$scope.newUser = {};
			}
		});
	};

	$scope.login = function(){
		logAndRegFactory.login($scope.user,function(logged_in,data){
			if(logged_in){
				console.log("Successfully Logged In");
				localStorageService.set('user',data);
				$location.path('/dashboard');
				$scope.loginError = false;
			} else {
				console.log("Not Logged In");
				$scope.loginError = data;
			}
			$scope.user = {};
		});
	};
});

dB.controller('dashboardController',function($scope, localStorageService, dashboardFactory){
	var user = localStorageService.get('user');
	$scope.user = user;

	dashboardFactory.getTopics(function(data){
		console.log(data);
		$scope.topics = data;
	});

	$scope.addTopic = function(){
		dashboardFactory.addTopic($scope.newTopic,user,function(data){
			$scope.topics = data;
		});	
		$scope.newTopic = {};
	};

	$scope.logout = function(){
		console.log('Logged Out');
		localStorageService.clearAll();
	};
});

dB.controller('topicController',function($scope, $location, localStorageService, topicFactory){
	var url = $location.url().slice(7);
	var user = localStorageService.get('user');
	$scope.user = user;

	topicFactory.getTopic(url,function(data){
		$scope.topic = data;
		$scope.messages = data.messages;
	});

	$scope.logout = function(){
		console.log('Logged Out');
		localStorageService.clearAll();
	};

	$scope.addMessage = function(){
		topicFactory.addMessage($scope.newMessage,url,user,function(data){
			$scope.topic = data;
			$scope.messages = data.messages;
			$scope.newMessage = {};
		});
	};

	$scope.addComment = function(){
		//The new Comment is stored in the current message as newComment!!
		for(var message in $scope.messages){
			if($scope.messages[message].newComment){
				info = $scope.messages[message];
			}
		}

		topicFactory.addComment(info,user,function(data){
			for(var message in $scope.messages){
				$scope.messages[message].newComment = {};
			}
			$scope.topic = data;
			$scope.messages = data.messages;
		});
	};

});

dB.controller('userController',function($scope, $location, localStorageService,userFactory){
	var url = $location.url().slice(6);
	var user = localStorageService.get('user');
	$scope.user = user;

	userFactory.getUserInfo(url,function(data){
		$scope.userInfo = data;
	});
});

dB.filter('length',function(){
	return function(string){
		var length = string.length;
		return length;
	};
});















