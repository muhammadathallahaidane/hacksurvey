const router = require('express').Router()
const Controller = require('../controllers/controller')
const UserController = require('../controllers/UserController')

function isRegistered(req, res, next) {
    if (!req.session.UserId) {
        return res.redirect('/login?error=Please Register first')
    }
    next()
}

function isLoggedIn(req, res, next) {
    if (!req.session.UserId) {
        return res.redirect('/login?error=Please login first')
    }
    next()
}

function roleFilter(req, res, next) {
    if (req.session.role === 'Surveyor') {
        return Controller.allShips(req, res)
    } else if (req.session.role === 'Owner') {
        return Controller.ships(req, res)
    }
    next()
}

router.get('/', isRegistered, UserController.getAddProfile);
router.post('/', isRegistered, UserController.postAddProfile);
router.get('/:id', isLoggedIn, Controller.profileHome);
router.get('/:id/logout', isLoggedIn, Controller.profileLogout);
router.get('/:id/edit', isLoggedIn, Controller.getProfileEdit);
router.post('/:id/edit', isLoggedIn, Controller.postProfileEdit);
router.get('/:id/detail', isLoggedIn, Controller.profileDetail);
router.get('/:id/delete', isLoggedIn, Controller.deleteProfile);

router.get('/:id/ships', isLoggedIn, roleFilter);
router.get('/:id/ships/add', isLoggedIn, Controller.getAddShips);
router.post('/:id/ships/add', isLoggedIn, Controller.postAddShips);
router.get('/:id/ships/export', isLoggedIn, Controller.shipListToPDF);
router.get('/:id/ships/:shipId/delete', isLoggedIn, Controller.deleteShips);

module.exports = router