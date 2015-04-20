var mongoose = require('mongoose');
var Comment = require('./comment.js');

var MessageSchema = mongoose.Schema({
	_topic: {type: mongoose.Schema.ObjectId, ref: "Topic"},
	message: String,
	author: String,
	votes: Number,
	comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}],
	created_at: Date
});

mongoose.model('Message',MessageSchema);