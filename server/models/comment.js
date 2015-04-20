var mongoose = require('mongoose');

var CommentSchema = mongoose.Schema({
	_message: {type: mongoose.Schema.ObjectId, ref: "Message"},
	comment: String,
	author: String,
	votes: Number,
	created_at: Date
});

mongoose.model('Comment',CommentSchema);