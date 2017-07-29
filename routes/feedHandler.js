/**
 * Created by Admin on 29-Jul-17.
 */

var express = require("express");

var router = express.Router();

var Feed = require('../model/feed');

router.route('/').
    get(function (req, res){

        Feed.find({}, function (err, feeds) {
            if(err)
                res.send('DB Err : ' + err);
            else
                res.send(feeds);
        })
    }).
    post(function (req, res) {

        var feedData = {};
        feedData.title = req.title;
        feedData.content = req.content;
        feedData.author = req.author;
        feedData.tags = req.tags;

        var newFeed = new Feed(feedData);

        newFeed.save(function (err) {

            if(err) {
                res.send("DB Error : " + err);
            }
            else{
                res.send("New Feed Added");
            }
        });



});

module.exports = router;