const hotel = require('./controller');
var router = require('express').Router();

router.post('/create', hotel.create);
router.get('/list', hotel.list);
router.post('/booking', hotel.booking);
router.post('/bookingCancel', hotel.bookingCancel);

module.exports = router