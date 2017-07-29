/**
 * Created by Admin on 29-Jul-17.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({

    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('User', userSchema);