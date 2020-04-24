const userController = require('../controllers/user-controller');
const router = require('express').Router();
const redirect = require('./redirect');

router.get('/', redirect.nonLoginUser, userController.home);

router.get('/login', redirect.loginUser, userController.login);

// router.post('/login/send', passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login'
// }));

router.get('/logout', userController.logout);

router.get('/register', redirect.loginUser, userController.register);

router.post('/register/send', userController.sendRegister);

router.get('/test', userController.test);

module.exports = router;