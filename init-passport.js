
const User = require('./api/models/user-model');
const LocalStrategy = require('passport-local').Strategy;

module.exports = (passport) => {
    function authenticateUser(username, password, done) {
        User.findOne({ username: username }, (err, record) => {
            if (err) {
                return done(err);
            }
    
            if (!record) {
                return done(null, false, { message: 'Incorrect username. ' });
            }
    
            if (record.password !== password) {
                return done(null, false, { message: 'Incorrect password. ' });
            }
    
            return done(null, record);
        });
    }
    
    passport.use(new LocalStrategy(authenticateUser));
    
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, record) => {
            if (err) { done(err); }
            if (record) { done(null, record); }
        });
    });  
}