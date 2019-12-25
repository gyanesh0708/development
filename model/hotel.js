// const mongoose = require('mongoose');
const mongoose = require('mongoose'); 
mongoose.set('useCreateIndex', true);
const moment = require('moment');
const paginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const HotelSchema = new Schema({
    hotelName: {
        type: String,
        unique: true
    },
    type: String,
    address: {
        type: String,
        default: '',
        trim: true
    },
    totalRooms: Number,
    totalRoomsAvailabe: Number,
    contact: Number,
    bookings: [{
        "uid": String,
        "bookingId" : String,
        "bookingStatus": String,
        "name": String,
        "RoomNo": Number
    }],
    createdOn: {
        type: Date,
        default: Date.now()
    },
    updatedOn: {
        type: Date,
        default: Date.now()
    },
});


HotelSchema.plugin(paginate);
mongoose.model('Hotel', HotelSchema);