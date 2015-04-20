var mongoose = require('mongoose');
var Topic = mongoose.model('Topic');
var Message = mongoose.model('Message');
var Comment = mongoose.model('Comment');

module.exports = (function(){
	return {
		find: function(req,res){
			Topic.findOne({_id: req.body.id}).populate({path: 'messages'}).exec(function(err,topic){
				
				var options = {
					path: 'messages.comments',
					model: "Comment"
				};

				if(err) return res.json(500);

				Topic.populate(topic,options,function(err,result){
					res.json(result);
				});

			});
		},
		newMessage: function(req,res){
			Topic.findOne({_id: req.body.id},function(err,result){
				var message = new Message({
					_topic: result._id,
					message: req.body.message,
					author: req.body.user.username,
					votes: 0,
					created_at: new Date()
				});
				result.messages.push(message);
				message.save(function(err){
					if(err){
						console.log(err);
					} else {
						result.save(function(err,result){
							if(err){
								console.log(err);
							} else {
								Topic.findOne({_id: req.body.id}).populate({path: 'messages'}).exec(function(err,topic){
				
									var options = {
										path: 'messages.comments',
										model: "Comment"
									};

									if(err) return res.json(500);

									Topic.populate(topic,options,function(err,result){
										res.json(result);
									});

								});
							}
						});
					}
				});
			});
		},
		newComment: function(req,res){
			Message.findOne({_id: req.body.info._id},function(err,result){
				var comment = new Comment({
					_message: result._id,
					comment: req.body.info.newComment.comment,
					author: req.body.user.username,
					votes: 0,
					created_at: new Date()
				});
				result.comments.push(comment);
				comment.save(function(err){
					if(err){
						console.log(err);
					} else {
						result.save(function(err,result){
							if(err){
								console.log(err);
							} else {
								Topic.findOne({_id: req.body.info._topic}).populate({path: 'messages'}).exec(function(err,topic){
									
									var options = {
										path: 'messages.comments',
										model: "Comment"
									};

									if(err) return res.json(500);

									Topic.populate(topic,options,function(err,result){
										res.json(result);
									});

								});
							}
						});
					}
				});
			});
		}
	};
})();