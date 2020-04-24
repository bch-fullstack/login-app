const express = require('express');
const app = express();
const PORT = 8888;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const findOrCreate = require('mongoose-findorcreate');
const session = require('express-session'); // <<<
const passport = require('passport'); // <<<
const LocalStrategy = require('passport-local').Strategy; // <<<
const User = require('./api/models/user-model');
const apiRoutes = require('./api/routes/api-routes');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({ secret: 'cats' })); // <<<
app.use(passport.initialize()); // <<<
app.use(passport.session()); // <<<

mongoose.connect('mongodb://localhost:27017/test');

const db = mongoose.connection;
db.on('error', (err) => { console.log(`An error has occcured while connecting to DB: ${err}`); });
db.on('open', () => { console.log(`Connected to database. `); });

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

app.use('/', apiRoutes);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});