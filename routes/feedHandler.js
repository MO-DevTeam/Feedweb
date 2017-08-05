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
                res.send('DB Error : ' + err);
            else
                res.send(feeds);
        })
    }).
    post(function (request, res) {

        var feedData = {};
        var req = request.body;
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

router.route('/:feedId').
    get(function (req, res) {

        Feed.findById(req.params.feedId, function (err, feed) {
            if (err){
                res.send("DB Error: " + err);
            }
            else{
                var feedArray = [feed];
                res.send(feedArray);
            }
        } )
});

router.route('/comment/:feedId').
    post(function (request, res) {

    var req = request.body;
    Feed.findById(request.params.feedId, function (err, feed) {
        if (err){
            res.send("DB Error: " + err);
        }
        else{
            feed.comments.push(req);
            feed.save(function (err) {
                if (err){
                    res.send("DB Error: " + err);
                }
                else{
                    res.send("Comment Added");
                }
            })
        }
    })
});

router.route("/upvote/:feedId").
    post(function (request, res) {

    var req = request.body;
        Feed.findById(request.params.feedId, function (err, feed) {
            if (err){
                res.send("DB Error: " + err);
            }
            else {
                feed.upvotes.push(req.user);
                feed.save(function (err) {
                    if (err){
                        res.send("DB Error: " + err);
                    }
                    else{
                        res.send("Upvote Added");
                    }
                })
            }
        })
});

router.route("/downvote/:feedId").
post(function (request, res) {

    var req = request.body;
    Feed.findById(request.params.feedId, function (err, feed) {
        if (err){
            res.send("DB Error: " + err);
        }
        else {
            feed.upvotes.splice(feed.upvotes.indexOf(req.user), 1);
            feed.save(function (err) {
                if (err){
                    res.send("DB Error: " + err);
                }
                else{
                    res.send("Upvote Removed");
                }
            })
        }
    })
});

module.exports = router;