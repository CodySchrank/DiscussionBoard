var users = require('./../server/controllers/users.js');
var dashboard = require('./../server/controllers/dashboard.js');
var topics = require('./../server/controllers/topics.js');

module.exports = function(app){
	app.post('/users/new',function(req,res){
		users.add(req,res);
	});

	app.post('/users/login',function(req,res){
		users.login(req,res);
	});

	app.get('/dashboard/topics',function(req,res){
		dashboard.topics(req,res);
	});

	app.post('/dashboard/topic/new',function(req,res){
		dashboard.add(req,res);
	});

	app.post('/topic',function(req,res){
		topics.find(req,res);
	});

	app.post('/topic/message/new',function(req,res){
		topics.newMessage(req,res);
	});

	app.get('/user/:username',function(req,res){
		users.show(req,res);
	});

	app.post('/topic/comment/new',function(req,res){
		topics.newComment(req,res);
	});
};
