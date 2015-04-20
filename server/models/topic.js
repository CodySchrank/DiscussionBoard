var mongoose = require('mongoose');
var Message = require('./message.js');

var TopicSchema = mongoose.Schema({
	name: String,
	description: String,
	category: String,
	author: String,
	votes: Number,
	messages: [{type: mongoose.Schema.Types.ObjectId, ref: "Message"}],
	created_at: Date
});

mongoose.model('Topic',TopicSchema);
