const users = require('./controller');
var router = require('express').Router();

router.post('/create', users.create);
router.get('/list', users.list);
router.post('/login', users.login);
router.post('/pointUpdate', users.pointUpdate);


module.exports = router 