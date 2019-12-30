//During the test the env variable is set to test
process.env.NODE_ENV = 'test';


//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app.js');
let mocha = require('mocha')
let should = chai.should();
const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const Hotel = mongoose.model('Hotel');
let serverUrl = "http://localhost:3000"



chai.use(chaiHttp);

let user = {
    "name": "gyanesh.saikhedkar@gmail.com",
    "password": "hotel@1234"

}
let user_2 = {
    "name": "admin@gmail.com",
    "password": "hotel@1234"

}

let hotel_1 = {
    "hotelName": "Sun and Sand",
    "type": "4 Star",
    "address": "Mumbai - Juhu",
    "contact": 787879692393,
    "totalRooms": 4,
    "totalRoomsAvailabe": 3
}

let hotel_2 = {
    "hotelName": "Orchid",
    "type": "5 Star",
    "address": "Mumbai - Andheri",
    "contact": 9599962318,
    "totalRooms": 4,
    "totalRoomsAvailabe": 3
}



describe('Case 1 :  User 1 Sign Up: /api/users/create', () => {

    it('it should create new User for ' + user.name, (done) => {

        chai.request(serverUrl)
            .post('/api/users/create')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('name');
                res.body.should.have.property('bonus');
                res.body.should.have.property('hotelBookings');
                res.body.hotelBookings.should.be.a('array');
                res.body.name.should.equal(user.name);
                res.body.bonus.should.equal(500);
                done();
            });


    });
});

describe('Case 2 :  Registering Two hotel :/api/hotel/create', () => {

    it('it should create 2 new Hotel ', (done) => {

        chai.request(serverUrl)
            .post('/api/hotel/create')
            .send(hotel_1)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('address');
                res.body.should.have.property('createdOn');
                res.body.should.have.property('updatedOn');
                res.body.should.have.property('_id');
                res.body.should.have.property('hotelName');
                res.body.should.have.property('type');
                res.body.should.have.property('contact');
                res.body.should.have.property('totalRooms');
                res.body.should.have.property('totalRoomsAvailabe');
                res.body.should.have.property('bookings');
                res.body.bookings.should.be.a('array');
            });
        chai.request(serverUrl)
            .post('/api/hotel/create')
            .send(hotel_2)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('address');
                res.body.should.have.property('createdOn');
                res.body.should.have.property('updatedOn');
                res.body.should.have.property('_id');
                res.body.should.have.property('hotelName');
                res.body.should.have.property('type');
                res.body.should.have.property('contact');
                res.body.should.have.property('totalRooms');
                res.body.should.have.property('totalRoomsAvailabe');
                res.body.should.have.property('bookings');
                res.body.bookings.should.be.a('array');
                done();
            });
    });
});



describe('Case 3 : Registering Hotel which is alredy Registered  : /api/hotel/create', () => {

    it('Again Testing /api/hotel/create api for the same name ' + hotel_1.hotelName + ' and it will return {"server_msg" : "Hotel already exist!!"} ', (done) => {

        chai.request(serverUrl)
            .post('/api/hotel/create')
            .send(hotel_1)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('server_msg');
                res.body.server_msg.should.equal("Hotel already exist!!");
                done();
            });
    });
});

describe('Case 4 : Siging Up User again which was already signed up : /api/users/create', () => {

    it('Again Testing /api/users/create api for the same name ' + user.name + ' and it will return {"server_msg" : "User already exist!!"}', (done) => {

        chai.request(serverUrl)
            .post('/api/users/create')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('server_msg');
                res.body.server_msg.should.equal("User already exist!!");
                done();
            });
    });
});
var responseObj = {
    "uid": "",
    "hid": ""
}
describe('Case 5 : Login In user  ' + user.name + ' and check for the hotel List: /api/users/login', () => {
    it('should return user object for further use', (done) => {

        chai.request(serverUrl)
            .post('/api/users/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('name');
                res.body.should.have.property('bonus');
                res.body.should.have.property('hotelBookings');
                res.body.hotelBookings.should.be.a('array');
                res.body.name.should.equal(user.name);
                res.body.bonus.should.equal(500);
                responseObj.uid = res.body._id

            });

        chai.request(serverUrl)
            .get('/api/hotel/list?offset=0')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('docs').with.lengthOf(2);
                res.body.should.have.property('total');
                res.body.should.have.property('limit');
                res.body.should.have.property('offset');
                res.body.docs.should.be.a('array');
                res.body.docs.should.lengthOf(2)
                responseObj.hid = res.body.docs[0]._id
                done();
            });


    });
});
describe('Case 6 :  Sign up User 2: /api/users/create', () => {

    it('it should create new User for ' + user_2.name, (done) => {
        chai.request(serverUrl)
            .post('/api/users/create')
            .send(user_2)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('name');
                res.body.should.have.property('bonus');
                res.body.should.have.property('hotelBookings');
                res.body.hotelBookings.should.be.a('array');
                res.body.name.should.equal(user_2.name);
                res.body.bonus.should.equal(500);
                done();
            });
    });
});
describe('Case 7 : After Preparing responseObj by last test making first booking  : /api/hotel/booking', () => {
    it('should return user object after booking', (done) => {

        chai.request(serverUrl)
            .post('/api/hotel/booking')
            .send(responseObj)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('name');
                res.body.should.have.property('bonus');
                res.body.should.have.property('hotelBookings');
                res.body.hotelBookings.should.be.a('array');
                res.body.name.should.equal(user.name);
                res.body.bonus.should.equal(300);
                res.body.hotelBookings.should.lengthOf(1)
                res.body.hotelBookings[0].bookingStatus.should.equal("BOOKED");
                responseObj.bookingId = res.body.hotelBookings[0].bookingId
                done();

            });
    });
});



describe('Case 8 : After Preparing responseObj by last test making Second booking : /api/hotel/booking', () => {
    it('should return user object after booking', (done) => {

        chai.request(serverUrl)
            .post('/api/hotel/booking')
            .send(responseObj)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('name');
                res.body.should.have.property('bonus');
                res.body.should.have.property('hotelBookings');
                res.body.hotelBookings.should.be.a('array');
                res.body.name.should.equal(user.name);
                res.body.bonus.should.equal(100);
                res.body.hotelBookings.should.lengthOf(2)
                res.body.hotelBookings[1].bookingStatus.should.equal("BOOKED");
                responseObj.bookingId = res.body.hotelBookings[1].bookingId
                done();

            });
    });
});

describe(' Case 9 : After Preparing responseObj by last test making Third booking, So that we can get Pending Approval : /api/hotel/booking', () => {
    it('should return user object after booking', (done) => {

        chai.request(serverUrl)
            .post('/api/hotel/booking')
            .send(responseObj)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('name');
                res.body.should.have.property('bonus');
                res.body.should.have.property('hotelBookings');
                res.body.hotelBookings.should.be.a('array');
                res.body.name.should.equal(user.name);
                res.body.bonus.should.equal(100);
                res.body.hotelBookings.should.lengthOf(3)
                res.body.hotelBookings[2].bookingStatus.should.equal("PENDING APPROVAL");
                responseObj.bookingId = res.body.hotelBookings[2].bookingId
                done();

            });
    });
});




describe('Case 10 : Login In user  ' + user_2.name + ' and check for the hotel List: /api/users/login', () => {
    it('should return user object for further use', (done) => {

        chai.request(serverUrl)
            .post('/api/users/login')
            .send(user_2)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('name');
                res.body.should.have.property('bonus');
                res.body.should.have.property('hotelBookings');
                res.body.hotelBookings.should.be.a('array');
                res.body.name.should.equal(user_2.name);
                res.body.bonus.should.equal(500);
                responseObj.uid = res.body._id
                done();
            });

    });
});

describe('Case 11 : After Preparing responseObj by Login in second user ' + user_2.name + '  creating first booking for same hotel, So that the booking with Pending Approval associated with user first should get removed and assign to the second User : /api/hotel/booking', () => {
    it('should return user object after booking', (done) => {

        chai.request(serverUrl)
            .post('/api/hotel/booking')
            .send(responseObj)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('name');
                res.body.should.have.property('bonus');
                res.body.should.have.property('hotelBookings');
                res.body.hotelBookings.should.be.a('array');
                res.body.name.should.equal(user_2.name);
                res.body.bonus.should.equal(300);
                res.body.hotelBookings.should.lengthOf(1)
                res.body.hotelBookings[0].bookingStatus.should.equal("BOOKED");
                done();

            });
    });
});
