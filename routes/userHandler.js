/**
 * Created by Admin on 29-Jul-17.
 */


var express = require("express");

var router = express.Router();

var User = require('../model/user');

router.route('/').
post(function (req, res) {


    var userData = {};
    userData.username = req.username;
    userData.password = req.password;
    userData.email = req.email;
    userData.name = req.name;

    User.find({'username' : userData.username}, function (err, user) {
            if (!err){
                res.send("Error: Username is not unique")
            }
            else{
                var newUser = new User(userData);

                newUser.save(function (err, user) {

                    if(err) {
                        res.send("DB Error : " + err);
                    }
                    else{
                        res.send("New User Added");
                    }
                });
            }
        });

});


router.route('/:username').
get(function (req, res) {

    User.find({'username': req.params.username}, function (err, user) {
        if (err){
            res.send("DB Error : " + err);
        }
        else if (!user){
            res.send("Error: User not present");
        }
        else {
            res.send(user);
        }
    })
}).
post(function (req, res) {

    var userData = {};
    userData.password = req.password;

    User.findOne({'username': req.params.username}, function (err, user) {
        if (err){
            res.send("DB Error : " + err);
        }
        else if (userData.password !== user.password){
            res.send("Error: Incorrect Password");
        }
        else {
            res.send("Login Successful");
        }
    })

});

module.exports = router;