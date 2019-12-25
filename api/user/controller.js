const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const controller = {};


controller.create = async (req, res) => {
    try {
        let query = {},
            user = {};

        query.name = req.body.name;
        user = await Users.findOne(query).lean();
        if (user) {
            return res.status(404).send('User already exist with the given name ' + query.name);
        } else {
            user = new Users(req.body);
            user.setPassword(req.body.password);
            user.bonus = 500;
            user = await user.save();
            return res.status(200).send('User created successfully');
        }
    } catch (err) {
        res.status(500).send('internal server error', err);
    }
}


controller.pointUpdate = async (req, res) => {
    try {
        let query = {},
            user = {};

        query._id = req.body.uid;
        user = await Users.findOne(query).lean();
        if (user) {
            let updater = {$inc: {
                "bonus": req.body.bonus
            }}
            let options = {select: {
                "_id": 1,
                "name": 1,
                "bonus": 1
            }}
            let updateUser = await Users.findOneAndUpdate(query, updater,options)
            return res.status(200).send(updateUser);
        } else {
            return res.status(404).send({'msg':'User does not exist!!'});
        }
    } catch (err) {
        res.status(500).send('internal server error', err);
    }
}


controller.list = async (req, res) => {
    try {
        let query = {}
        var options = {
            sort: {
                'createdOn': -1
            },
            select: {
                "_id": 1,
                "name": 1,
                "bonus": 1,
                "hotelBookings" : 1,
                "totalBooking" : 1
            },
            limit: 10,
            offset: 0
        };
        if (req.query.offset != null) {
            options.offset = Number(req.query.offset)
        }
        const users = await Users.paginate(query, options)
        return res.status(200).send(users);
    } catch {
        return res.status(500).send({
            "server_msg": "Internal server error!!"
        });
    }
}

controller.login = async (req, res) => {
    try {
        let query = {},
            user = {};
        query.name = req.body.name;
        let foundUser = await Users.findOne(query);
        if (foundUser) {
            user = new Users(foundUser);
            if (user.validatePassword(req.body.password)) {
                return res.status(200).send({
                    "_id": foundUser._id,
                    "name": foundUser.name,
                    "bonus": foundUser.bonus,
                    "hotelBookings" : foundUser.hotelBookings,
                    "totalBooking" : foundUser.totalBooking
                });
            } else {
                res.status(200).send({
                    'Error': "Password Incorrect!!!"
                });
            }

        } else {
            return res.status(404).send('User not exist with the given name ' + query.name);

        }
    } catch (err) {
        res.status(500).send({
            'internal server error': "Error"
        });
    }

}




module.exports = controller;