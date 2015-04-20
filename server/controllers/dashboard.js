var mongoose = require('mongoose');
var Topic = mongoose.model('Topic');

module.exports = (function(){
	return {
		topics: function(req,res){
			Topic.find({},function(err,results){
				if(err){
					console.log(err);
				} else {
					res.json(results);
				}
			});
		},
		add: function(req,res){
			var topic = new Topic({
				name: req.body.post.name,
				description: req.body.post.description,
				category: req.body.post.category,
				author: req.body.user.username,
				votes: 0,
				created_at: new Date()
			});

			topic.save(function(err){
				if(err){
					console.log(err);
				} else {
					Topic.find({},function(err,results){
						if(err){
							console.log(err);
						} else {
							res.json(results);
						}
					});
				}
			});
		}
	};
})();