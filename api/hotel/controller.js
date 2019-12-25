const mongoose = require('mongoose');
const Hotel = mongoose.model('Hotel');
const Users = mongoose.model('Users');
const controller = {};

controller.create = async (req, res) => {
    try {
        const hotel = await new Hotel(req.body);
        console.log(hotel.save());
        return res.status(200).send(req.body);
    } catch {
        return res.status(500).send({
            "server_msg": "Internal server error!!"
        });
    }

}

controller.list = async (req, res) => {
    try {
        let query = {}
        var options = {
            sort: {
                'createdOn': -1
            },
            limit: 10,
            offset: 0
        };
        if (req.query.offset != null) {
            options.offset = Number(req.query.offset)
        }
        const hotel = await Hotel.paginate(query, options)
        return res.status(200).send(hotel);
    } catch {
        return res.status(500).send({
            "server_msg": "Internal server error!!"
        });
    }
}

controller.booking = async (req, res) => {
    try {
        let hotelQuery = {
            "_id": ""
        }
        let userQuery = {
            "_id": ""
        }
        hotelQuery._id = req.body.hid;
        userQuery._id = req.body.uid;
        let foundhotel = await Hotel.findOne(hotelQuery);
        let user = await Users.findOne(userQuery);
        var bookedRoomNo = foundhotel.totalRoomsAvailabe
        var bookingId = req.body.hid + req.body.uid + Date.now()
        var bookingStatus = "PENDING APPROVAL";
        var bookingAmt = 0;

        if (foundhotel && user) {
            if (foundhotel.totalRoomsAvailabe >= 1 && user.bonus >= 200) {
                bookingStatus = "BOOKED"
                bookingAmt = -200
            }
            let bookingObj = {
                "uid": req.body.uid,
                "bookingId": bookingId,
                "bookingStatus": bookingStatus,
                "name": user.name,
                "RoomNo": bookedRoomNo
            }
            let hotelBookingObj = {
                "hid": foundhotel._id,
                "hotelName": foundhotel.hotelName,
                "bookingId": bookingId,
                "bookingStatus": bookingStatus,
                "typed": foundhotel.type,
                "address": foundhotel.address,
                "contact": Number(foundhotel.contact),
                "RoomNo": Number(bookedRoomNo)
            }
            let hotelUpdater = {
                $push: {
                    "bookings": bookingObj
                },
                $inc: {
                    "totalRoomsAvailabe": -1
                }
            }
            let options = {
                upsert: true,
                new: true,
                select: {
                    "_id": 1,
                    "name": 1,
                    "bonus": 1,
                    "contact": 1,
                    "address": 1,
                    "type": 1,
                    "hotelName": 1,
                    "hotelBookings": 1
                }
            };
            let foundhotelUpdate = await Hotel.findOneAndUpdate(hotelQuery, hotelUpdater, options)
            let userUpdater = {
                $push: {
                    hotelBookings: hotelBookingObj
                },
                $inc: {
                    "totalBooking": 1,
                    "bonus": bookingAmt
                }
            }
            let userBookingUpdate = await Users.findOneAndUpdate(userQuery, userUpdater, options)
            if (foundhotelUpdate && userBookingUpdate) {

                return res.status(200).send(userBookingUpdate);
            } else {
                res.status(200).send({
                    'Error': "Hotel does not exist.Booking Cannot be done at this moment!!"
                });
            }

        } else {
            return res.status(200).send({
                'msg': 'Rooms not availabe at this moment try again later'
            });

        }
    } catch (err) {
        console.log(err)
        res.status(500).send({
            'msg': "Error"
        });
    }

}

controller.bookingCancel = async (req, res) => {
    try {
        let hotelQuery = {
            "_id": req.body.hid,
            "bookings.uid": req.body.uid,
            "bookings.bookingId": req.body.bookingId
        }
        let userQuery = {
            "_id": req.body.uid,
            "hotelBookings.hid": req.body.hid,
            "hotelBookings.bookingId": req.body.bookingId
        }
        let foundhotel = await Hotel.findOne(hotelQuery);
        let foundUser = await Users.findOne(userQuery);
        if (foundhotel && foundUser) {
            let hotelUpdater = {
                $pull: {
                    "bookings": {
                        "bookingId": req.body.bookingId
                    }
                },
                $inc: {
                    "totalRoomsAvailabe": 1
                }
            }
            let options = {
                upsert: true,
                new: true,
                select: {
                    "_id": 1,
                    "name": 1,
                    "bonus": 1,
                    "contact": 1,
                    "address": 1,
                    "type": 1,
                    "hotelName": 1,
                    "hotelBookings": 1
                }
            };
            let foundhotel = await Hotel.findOneAndUpdate(hotelQuery, hotelUpdater, options)
            let userUpdater = {
                $pull: {
                    hotelBookings: {
                        "bookingId": req.body.bookingId
                    }
                },
                $inc: {
                    "totalBooking": -1,
                }
            }
            let userBooking = await Users.findOneAndUpdate(userQuery, userUpdater, options)
            if (foundhotel && userBooking) {
                return res.status(200).send(userBooking);
            } else {
                res.status(200).send({
                    'Error': "Unable to cancel the booking at this moment.Contact admin!!"
                });
            }

        } else {

            return res.status(200).send({
                'msg': 'No booking found with the reference id provided!!'
            });

        }
    } catch (err) {
        console.log(err)
        res.status(500).send({
            'msg': "Something went wrong!!"
        });
    }

}




module.exports = controller;