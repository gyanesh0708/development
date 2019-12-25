
API Document

Hotel Booking System 

POSTMAN Link : https://www.getpostman.com/collections/c9bf01cf4ab29d23e946

Contact for Whitelisting the Mongo Instance for your public ip

Contents

1.	Hotel registration
2.	List of hotel
3.	Hotel booking by user
4.	Hotel Booking cancel by user 
5.	User Registration 
6.	User Login 
7.	List of User
8.	User point update

Registration of hotel
URL : localhost:3000/api/hotel/create.
Type: POST
header :{ Content-Type : application/json}
body :{
    "hotelName": "mumbai - Paradise",
    "type": "5 Star",
    "address": "mumbai Pune",
    "contact":787879692393,
     "totalRooms":20,
    "totalRoomsAvailabe":20
}
Response : {
    "hotelName": "mumbai - Paradise",
    "type": "5 Star",
    "address": "mumbai Pune",
    "contact": 787879692393,
    "totalRooms": 20,
    "totalRoomsAvailabe": 20
}

List of Hotels
URL: 	localhost:3000/api/hotel/list?offset=0
Type: GET
Response : {
    "docs": [
        {
            "address": "Baner Pune",
            "createdOn": "2019-12-25T08:30:15.710Z",
            "updatedOn": "2019-12-25T08:30:15.710Z",
            "_id": "5e031ebf9eeb4b2ba8b4779f",
            "hotelName": "Pune - Paradise",
            "type": "5 Star",
            "contact": 787879692393,
            "totalRooms": 20,
            "totalRoomsAvailabe": 20,
            "bookings": [],
            "__v": 0
        }    
    ],
    "total": 4,
    "limit": 10,
    "offset": 0
}

Hotel Booking by User
URL : localhost:3000/api/hotel/booking
Type: POST
header :{ Content-Type : application/json}
body {
	"hid" :"5e031f2e9eeb4b2ba8b477a0" ,  // _id of Hotel from the hotel list 
	"uid" : "5e031f549eeb4b2ba8b477a1"  //  _id of user from login response
}
Response : {
    "_id": "5e031f549eeb4b2ba8b477a1",
    "name": "naveen.singh@gmail.com",
    "hotelBookings": [
        {
            "date": "2019-12-25T08:30:15.724Z",
            "_id": "5e031fca9eeb4b2ba8b477a4",
            "hid": "5e031f2e9eeb4b2ba8b477a0",
            "hotelName": "mumbai - Paradise",
            "bookingId": "5e031f2e9eeb4b2ba8b477a05e031f549eeb4b2ba8b477a11577263050471",
            "typed": "5 Star",
            "address": "mumbai Pune",
            "contact": 787879692393,
            "RoomNo": 20
        }
    ],
    "bonus": 300
}

Hotel Booking Cancel by User
URL : localhost:3000/api/hotel/bookingCancel
Type: POST
header :{ Content-Type : application/json}
body {
"hid" :"5e031f2e9eeb4b2ba8b477a0" ,  // _id of Hotel from the hotel list 
"uid" : "5e031f549eeb4b2ba8b477a1"  //  _id of user from login response,
"bookingId": "5e031f2e9eeb4b2ba8b477a05e031f549eeb4b2ba8b477a11577263050471" // from booking Response 
}
Response : {
    "_id": "5e031f549eeb4b2ba8b477a1",
    "name": "naveen.singh@gmail.com",
    "hotelBookings": [
        {
            "date": "2019-12-25T08:30:15.724Z",
            "_id": "5e031fca9eeb4b2ba8b477a4",
            "hid": "5e031f2e9eeb4b2ba8b477a0",
            "hotelName": "mumbai - Paradise",
            "bookingId": "5e031f2e9eeb4b2ba8b477a05e031f549eeb4b2ba8b477a11577263050471",
            "typed": "5 Star",
            "address": "mumbai Pune",
            "contact": 787879692393,
            "RoomNo": 20
        } ],  "bonus": 300}
User Signup
URL : localhost:3000/ api/users/create
Type: POST
header :{ Content-Type : application/json}
body {
	"name":"gyanesh.saikhedkar@gmail.com",
	"password" : "hotel@1234"
}
Response : User Created Succesfully

User Login
URL : localhost:3000/ api/users/login
Type: POST
header :{ Content-Type : application/json}
body {
	"name":"gyanesh.saikhedkar@gmail.com",
	"password" : "hotel@1234"
}
Response : {
    "_id": "5e031f549eeb4b2ba8b477a1",
    "name": "naveen.singh@gmail.com",
    "bonus": 500,
    "hotelBookings": []
}

User Bonus Update
URL : localhost:3000/ api/users/ pointUpdate
Type: POST
header :{ Content-Type : application/json}
body {
	"uid" : "5e01a64eaf7572109c3e2970", // User _id
	"bonus" : 400
}
Response : {
    "_id": "5e01a64eaf7572109c3e2970",
    "name": "gyanesh.gyanesh@gmail.com",
    "bonus": 700
}

User List
URL : localhost:3000/api/users/list?offset=0
Type: GET
Response : {
    "docs": [
        {
            "_id": "5e031f549eeb4b2ba8b477a1",
            "name": "naveen.singh@gmail.com",
            "hotelBookings": [],
            "bonus": 300,
            "totalBooking": 0
        },
        {
            "_id": "5e03256d9eeb4b2ba8b477a5",
            "name": "admin@gmail.com",
            "hotelBookings": [],
            "bonus": 500
        },
        {
            "_id": "5e01b225577d6b1fb42caeae",
            "name": "gyanesh.saikhedkar@gmail.com",
            "bonus": 500,
            "hotelBookings": []
        },
        {
            "_id": "5e01a64eaf7572109c3e2970",
            "name": "gyanesh.gyanesh@gmail.com",
            "bonus": 700,
            "hotelBookings": [],
            "totalBooking": 0
        }
    ],
    "total": 4,
    "limit": 10,
    "offset": 0
}


