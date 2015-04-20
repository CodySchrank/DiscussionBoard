var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
	name: String,
	username: String,
	email: String,
	password: String,
	created_date: String,
	date: Date
});

mongoose.model('User',UserSchema);