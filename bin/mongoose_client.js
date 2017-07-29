/**
 * Created by Admin on 29-Jul-17.
 */

var mongoose = require("mongoose");

var connectDB = function (callback, fallback) {
    mongoose.connect('mongodb://localhost:27017');
    var db = mongoose.connection;
    db.on('error',function (error) {
        fallback(error);
    });
    db.once('open',function (obj) {
        console.log("mongoose client: connect success");
        callback(obj);
    });
};

exports.connectDB = connectDB;
