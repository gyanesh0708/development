const mongoose = require('mongoose');
const Hotel = mongoose.model('Hotel');
const Users = mongoose.model('Users');
const controller = {};

controller.create = async (req, res) => {
    try {
        const hotel = await new Hotel(req.body);
        await hotel.save();
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
        var bookingId = req.body.hid + req.body.uid + Date.now()
        var bookingStatus = "PENDING APPROVAL";
        var bookingAmt = 0;
        var userHotelBookingResult = user.hotelBookings
        var foundhotelBookingResult = foundhotel.bookings
        var pendingBooking = 0;
        var hotelPendingBooking = 0;
        var requestObj = {
            "hid": "",
            "uid": "",
            "bookingId": ""
        }

        for (var i = 0; i < userHotelBookingResult.length; i++) {
            if (userHotelBookingResult[i].bookingStatus == "PENDING APPROVAL") {
                pendingBooking = pendingBooking + 1
            }
        }
        for (var j = 0; j < foundhotelBookingResult.length; j++) {
            if (foundhotelBookingResult[j].bookingStatus == "PENDING APPROVAL") {
                hotelPendingBooking = hotelPendingBooking + 1
                requestObj.hid = foundhotel._id
                requestObj.bookingId = foundhotelBookingResult[j].bookingId
                requestObj.uid = foundhotelBookingResult[j].uid
            }
        }
        if (foundhotel && user && pendingBooking < 1) { 
            if (foundhotel.totalRoomsAvailabe >= 1 && user.bonus >= 200) {
                bookingStatus = "BOOKED"
                bookingAmt = -200
            }
            if (foundhotel.totalRoomsAvailabe == 0 && hotelPendingBooking >= 1) {
                console.log("totalRoomsAvailabe 0 and  hotelPendingBooking " + hotelPendingBooking)
                if (user.bonus >= 200) {
                    bookingStatus = "BOOKED"
                    bookingAmt = -200
                }
                let genericBookingCancelResponse = await genericBookingCancel(requestObj);
                if (genericBookingCancelResponse.responseMsg != "Booking Cancel Success!!") {
                  return  res.status(200).send({
                        "hotelName": foundhotel.hotelName,
                        "totalRoomsAvailable": foundhotel.totalRoomsAvailabe,
                        "pendingBooking": pendingBooking,
                        "userBonus": user.bonus,
                        "server_msg": "Sorry we are not able to serve you at this moment!!"
                    });
                }else{
                    foundhotel.totalRoomsAvailabe = foundhotel.totalRoomsAvailabe + 1
                }
            }
            if (foundhotel.totalRoomsAvailabe == 0 && hotelPendingBooking == 0) {
                return  res.status(200).send({
                        "hotelName": foundhotel.hotelName,
                        "totalRoomsAvailable": foundhotel.totalRoomsAvailabe,
                        "pendingBooking": pendingBooking,
                        "userBonus": user.bonus,
                        "server_msg": "There is no room available at this moment!!"
                    });
            }
            let bookingObj = {
                "uid": req.body.uid,
                "bookingId": bookingId,
                "bookingStatus": bookingStatus,
                "name": user.name,
                "RoomNo": foundhotel.totalRoomsAvailabe
            }
            let hotelBookingObj = {
                "hid": foundhotel._id,
                "hotelName": foundhotel.hotelName,
                "bookingId": bookingId,
                "bookingStatus": bookingStatus,
                "typed": foundhotel.type,
                "address": foundhotel.address,
                "contact": Number(foundhotel.contact),
                "RoomNo": Number(foundhotel.totalRoomsAvailabe)
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
            var server_msg = "";
            if (pendingBooking > 1) {
                server_msg = "User cannot have more than one pending approval!!"
            } else if (user.bonus < 200) {
                server_msg = "User do not have Enough Bonus to complete this booking!!"
            } else if (!foundhotel.totalRoomsAvailabe > 1) {
                server_msg = "There is no room available at this moment!!"
            }
            let responseObj = {
                "totalRoomsAvailable": foundhotel.totalRoomsAvailabe,
                "pendingBooking": pendingBooking,
                "userBonus": user.bonus,
                "server_msg": server_msg
            }
            return res.status(200).send(responseObj);

        }
    } catch (err) {
        console.log(err)
        res.status(500).send({
            'msg': "Error"
        });
    }

}

controller.bookingCancel = async (req, res) => {

    let queryObj = {
        hid: req.body.hid,
        uid: req.body.uid,
        bookingId: req.body.bookingId
    }
    let responseObj = await genericBookingCancel(queryObj)
    res.status(responseObj.responseCode).send(responseObj);
}


async function genericBookingCancel(queryObj) {
    let callbackresponseObj = {
        responseCode: 0,
        responseMsg: "",
        responseObj: ""
    }
    try {
        let hotelQuery = {
            "_id": queryObj.hid,
            "bookings.uid": queryObj.uid,
            "bookings.bookingId": queryObj.bookingId
        }
        let userQuery = {
            "_id": queryObj.uid,
            "hotelBookings.hid": queryObj.hid,
            "hotelBookings.bookingId": queryObj.bookingId
        }
        let foundhotel = await Hotel.findOne(hotelQuery);
        let foundUser = await Users.findOne(userQuery);
        if (foundhotel && foundUser) {
            let hotelUpdater = {
                $pull: {
                    "bookings": {
                        "bookingId": queryObj.bookingId
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
                        "bookingId": queryObj.bookingId
                    }
                },
                $inc: {
                    "totalBooking": -1,
                }
            }
            let userBooking = await Users.findOneAndUpdate(userQuery, userUpdater, options)
            if (foundhotel && userBooking) {
                callbackresponseObj.responseCode = 200;
                callbackresponseObj.responseMsg = "Booking Cancel Success!!";
                callbackresponseObj.responseObj = userBooking;
                return callbackresponseObj;
            } else {
                callbackresponseObj.responseCode = 200;
                callbackresponseObj.responseMsg = "Unable to cancel the booking at this moment.Contact admin!!";
                return callbackresponseObj;

            }

        } else {
            callbackresponseObj.responseCode = 200;
            callbackresponseObj.responseMsg = "No booking found with the reference id provided!!";
            return callbackresponseObj;


        }
    } catch (err) {
        console.log(err)
        callbackresponseObj.responseCode = 500;
        callbackresponseObj.responseMsg = "Something went Wrong!!";
        return callbackresponseObj;
    }
}

module.exports = controller;