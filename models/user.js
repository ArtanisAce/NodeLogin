var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//mongoose.connect('mongodb://localhost/nodeauth');

var db = mongoose.connection;

var UserSchema = mongoose.Schema({
    name:{
        type:String
    },
    username:{
        type:String,
        index:true
    },
    password:{
        type:String,
        
    },
    email:{
        type:String
    }
    
});

var User = module.exports = mongoose.model('User',UserSchema);//aqui creamos nuestro modelo, que sera el 
                                                              //constructor de nuestro objeto de users.js
                                                              
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if(err) return callback(err);
		callback(null, isMatch);
	});
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}                                                              
                                                              
                                                              
module.exports.createUser = function(newUser, callback) {
	bcrypt.hash(newUser.password,null,null,function(err, hash){
		if(err) throw err;
		// Set hashed pw
		newUser.password = hash;
		// Create User
		newUser.save(callback)
	});
}