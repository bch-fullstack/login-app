const express = require('express');
const app = express();
const PORT = 8888;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const findOrCreate = require('mongoose-findorcreate');
const session = require('express-session'); // <<<
const passport = require('passport'); // <<<
const LocalStrategy = require('passport-local').Strategy; // <<<

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({ secret: 'cats' })); // <<<
app.use(passport.initialize()); // <<<
app.use(passport.session()); // <<<

mongoose.connect('mongodb://localhost:27017/test');

const db = mongoose.connection;
db.on('error', (err) => { console.log(`An error has occcured while connecting to DB: ${err}`); });
db.on('open', () => { console.log(`Connected to database. `); });

const Schema = mongoose.Schema;
const userSchema = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    phone: String
});
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);

function redirectLoginUser(req, res, next){
    if (req.isAuthenticated()){
        res.redirect('/');
    } else {
        next();
    }
}

function redirectNonLoginUser(req, res, next){
    if (req.isUnauthenticated()){
        res.redirect('/login');
    } else {
        next();
    }
}

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

// only logged in user should be able to reach this endpoint
app.get('/', redirectNonLoginUser, (req, res) => {
    res.sendFile(__dirname + '/api/views/pages/home.html');
});

app.get('/login', redirectLoginUser, (req, res) => {
    res.sendFile(__dirname + '/api/views/pages/login.html');
});

app.post('/login/send', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

app.get('/register', redirectLoginUser, (req, res) => {
    res.sendFile(__dirname + '/api/views/pages/register.html');
});

app.post('/register/send', (req, res) => {
    User.findOrCreate({ username: req.body.username }, (err, record, created) => {
        if (err) { console.log(`An error has occured ${err}`); }
        if (created) {
            record.firstname = req.body.firstName;
            record.lastname = req.body.lastName;
            record.password = req.body.password;
            record.phone = req.body.phone;

            record.save()
                .then((data) => {
                    console.log(`Saved new user to database: ${data}`);
                    res.redirect('/login');
                })
                .catch((err) => {
                    console.log(`An error has occured when registering user: ${err}`);
                    res.redirect('/register');
                });
        } else {
            console.log(`A record with username ${req.body.username} found.`);
            res.send('Another user with this username has been registered');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});