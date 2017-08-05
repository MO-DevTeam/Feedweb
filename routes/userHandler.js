/**
 * Created by Admin on 29-Jul-17.
 */


var express = require("express");

var router = express.Router();

var User = require('../model/user');

router.route('/').post(function (request, res) {


    var userData = {};
    var req = request.body;
    userData.username = req.username;
    userData.password = req.password;
    userData.email = req.email;
    userData.name = req.name;
    var newUser = new User(userData);

    newUser.save(function (err, user) {
        if (err.name === 'MongoError' && err.code === 11000){
            res.send("Error: Username is not unique")
        }
        else if (err) {
            res.send("DB Error : " + err);
        }
        else {
            res.send("New User Added");
        }
    });

});


router.route('/:username').get(function (request, res) {
    var req = request.body;
    User.find({'username': request.params.username}, function (err, user) {
        if (err) {
            res.send("DB Error : " + err);
        }
        else if (!user) {
            res.send("Error: User not present");
        }
        else {
            res.send(user);
        }
    })
}).post(function (request, res) {
    var req = request.body;
    var userData = {};
    userData.password = req.password;

    User.findOne({'username': request.params.username}, function (err, user) {
        if (err) {
            res.send("DB Error : " + err);
        }
        else if (!user) {
            res.send("Error: User not present");
        }
        else if (req.password !== user.password) {
            console.log(req);
            res.send("Error: Incorrect Password");
        }
        else {
            res.send("Login Successful");
        }
    })

});

module.exports = router;