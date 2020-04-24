const express = require('express');
const app = express();
const PORT = 8888;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const apiRoutes = require('./api/routes/api-routes');
const initPassport = require('./init-passport');
const initMongoose = require('./init-mongoose');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({ secret: 'cats' }));
app.use(passport.initialize());
app.use(passport.session());

initPassport(passport);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/api/views');

initMongoose(mongoose);

app.use('/', apiRoutes);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});