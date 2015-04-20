var mongoose = require('mongoose');
var User = mongoose.model('User');
var moment = require('moment');
var validate = require('validate.js');
var date = new Date();

module.exports = (function(){
	return {
		add: function(req,res){

			var constraints = {
				name: {
					presence: true,
					format: {
						pattern: "[a-zA-Z_]+",
						message: "can only contain letters"
					}
				},
				username: {
					presence: true,
					format: {
						pattern: "[a-zA-Z0-9]+",
						message: "can only contain letters and numbers"
					}
				},
				email: {
					presence: true,
					email: true
				},
				password: {
					presence: true,
					length: {
						mininum: 6,
						message: "must be at least 6 characters"
					},

				},
				confirm: {
					presence: true,
					equality: "password"
				}
			};

			User.findOne({username: req.body.username},function(err,result){
				if(err){
					console.log(err);
				} else {
					if(!result){
						User.findOne({email: req.body.email},function(err,result){
							if(!result){
								var validation = validate({
									name: req.body.name, 
									username: req.body.username,
									email: req.body.email,
									password: req.body.password,
									confirm: req.body.confirm
								},constraints);
								if(validation){
									res.json(validation);
									return;
								} else {
									var user = new User({
										name: req.body.name,
										username: req.body.username,
										email: req.body.email,
										password: req.body.password,
										created_date: moment().format('MMM Do YYYY'),
										date: date
									});

									user.save(function(err){
										if(err){
											console.log(err);
										} else {
											User.find({},function(err){
												if(err){
													console.log(err);
												} else {
													res.end();
												}
											});
										}
									});
								}
							} else {
								res.json({emailTaken: "Email is taken"});
							}
						});
					} else {
						res.json({usernameTaken: "Username is taken"});
					}
				}
			});
		},

		login: function(req,res){
			User.findOne({email: req.body.email},function(err,result){
				if(err || result === null){
					console.log("err: ", err);
					res.json({logged_in: false, error: "Wrong Email"});
				} else {
					if(result.password == req.body.password){
						res.json({
							logged_in: true,
							user: {
								name: result.name,
								username: result.username,
								created_date: result.created_date
							}
						});
					} else {
						res.json({logged_in: false, error:"Wrong Password"});
					}
				}
			});
		},

		show: function(req,res){
			User.findOne({username: req.params.username},function(err,result){
				if(err){
					console.log(err);
				} else {
					res.json({
						name: result.name,
						username: result.username,
						email: result.email,
						created_date: result.created_date
					});
				}
			});
		}
	};
})();