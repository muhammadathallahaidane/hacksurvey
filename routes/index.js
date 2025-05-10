const router = require('express').Router()
const Controller = require('../controllers/controller')
const UserController = require('../controllers/UserController');
const routerProfile = require('./profiles');

// Auth & user routes
router.get('/', UserController.home);
router.get('/register-owner', UserController.getRegisterOwner);
router.post('/register-owner', UserController.postRegisterOwner);
router.get('/register-surveyor', UserController.getRegisterSurveyor);
router.post('/register-surveyor', UserController.postRegisterSurveyor);
router.get('/login', UserController.getLogin);
router.post('/login', UserController.postLogin);

// Profile + Ships (combined)
router.use('/profile', routerProfile);

module.exports = router;



module.exports = router