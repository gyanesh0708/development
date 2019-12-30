const mongoose = require('mongoose');
const paginate = require('mongoose-paginate');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    hash: String,
    salt: String,
    bonus: {
        type: Number
    },
    hotelBookings: [{
        hid: String,
        hotelName: String,
        typed: String,
        bookingId : String,
        bookingStatus: String,
        address: String,
        contact: Number,
        RoomNo: Number,
        date: {
            type: Date,
            default: Date.now()
        }
    }],
    totalBooking: Number,
    createdOn: {
        type: Date,
        default: Date.now()
    }
});


UsersSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    // crypto.pbkdf2Sync(password, salt, iterations, keylen, digest)
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 100, 'sha512')
        .toString('hex');
}


UsersSchema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 100, 'sha512')
        .toString('hex');
    return this.hash == hash;
}


UsersSchema.plugin(paginate);
mongoose.model('Users', UsersSchema);