var fs = require('fs');

var uploadProfilePic = function(req,res){
    // get the temporary location of the file
    var tmp_path = req.files.userPhoto.path;
    // set where the file should actually exists 
    var target_path = '/C:/Users/Pepo/Desktop/JAVASCRIPT/loginsystem/uploads' + req.files.userPhoto.name;
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) {
                throw err;
            }else{
                    var profile_pic = req.files.userPhoto.name;
                    //use profile_pic to do other stuffs like update DB or write rendering logic here.
             };
            });
        });
};

module.exports = uploadProfilePic;