const passport = require('passport');
const User = require('../models/user'); 
const LocalStrategy = require('passport-local');

function passportConfig () { 
    passport.use(new LocalStrategy (
        function(username, password, done) { 
            User.findOne({ username: username }, (err, user) => { 
                if(err) { return done(err); };
                if(!user) { return done(null, false); };
                if (!user.verifyPassword(password)) { return done(null, false); };
                console.log(user);
                return done(null, user);
            })
        }
    ))
}

module.exports = passportConfig;