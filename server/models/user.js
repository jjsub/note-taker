'use strict';


var bcrypt     = require('bcrypt'),
    request    = require('request'),
    path       = require('path'),
    AWS        = require('aws-sdk'),
    psql         = require('../postgres/manager');


function User(obj){
    this.username = obj.username;
}

User.register = function(obj, cb){
    var user = new User(obj);



   download(obj.avatar, function(url){
       user.avatar = url;
       user.password = bcrypt.hashSync(obj.password, 10);
       psql.query('insert into users (username, password, avatar) values($1, $2, $3) returning id',[user.username, user.password, user.avatar], cb);

   });
};


function download(url, cb){
    var s3   = new AWS.S3(),
        ext  = path.extname(url);


    require('crypto').randomBytes(60, function(ex, buf){
        var token = buf.toString('hex'),
            file = token + '.avatar' + ext,
            avatar = 'https://s3.amazonaws.com/' + process.env.AWS_BUCKET + '/' + file;

        request({url: url, encoding: null}, function(err, response, body){
            var params = {Bucket: process.env.AWS_BUCKET, Key: file, Body: body, ACL: 'public-read'};
            s3.putObject(params, function(){
                cb(avatar);
            });
        });
    });
}


User.login = function(obj, cb){
    psql.query('select * from users where username = $1 limit 1',[obj.username], function(err, resolt){
    if(err){
            return cb();
        }
        var user = resolt.rows[0];
        var isGood = bcrypt.compareSync(obj.password, user.password);

        if(!isGood){
            return cb();
        }

        cb(user);
    });
};

module.exports = User;


/*


UserSchema = new mongoose.Schema({
  username:  {type: String, required: true,  validate: [usernameV, 'username length'], unique: true},
  password:  {type: String, required: true,  validate: [passwordV, 'password length']},
  avatar:    {type: String, required: true},
  socketId:  {type: String, required: false, validate: [socketV, 'socket length']},
  createdAt: {type: Date,  required: true, default: Date.now}
});

UserSchema.methods.encrypt = function(){
  this.password = bcrypt.hashSync(this.password, 10);
};



UserSchema.statics.login = function(obj, cb){
  User.findOne({username: obj.username}, function(err, user){
    if(!user){
     return cb();
    }

    var isGood = bcrypt.compareSync(obj.password, user.password);

    if(!isGood){
      return cb();
    }

    cb(user);
  });
};

function usernameV(v){
  return v.length >= 3 && v.length <= 12;
}

function passwordV(v){
  return v.length === 60;
}

function socketV(v){
  return v.length === 20;
}

User = mongoose.model('User', UserSchema);
module.exports = User;
*/