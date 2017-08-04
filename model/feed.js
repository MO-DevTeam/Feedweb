/**
 * Created by Admin on 29-Jul-17.
 */


var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var feedSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    upvotes: {
        type: [String],
        default: []
    },
    author: {
        type: String,
        required: true
    },
    tags: {
        type: [String]
    },
    comments: {
        type: [{}],
        default: []
    }

});

module.exports = mongoose.model('Feed', feedSchema);
