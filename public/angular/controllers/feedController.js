/**
 * Created by Admin on 02-Aug-17.
 */

var feedController = function ($scope, $state, $http, $stateParams, authStorageAccess) {

    var rotate = true;

    var upvoteActive = true;

    // feeds variable
    $scope.feed = {};



    $scope.modUpvoteBtn = function () {
        if(!upvoteActive){
            $('.upvoteBtn').css({'background-color':'dodgerblue', 'color':'white'});
        }
        else{
            $('.upvoteBtn').css({'background-color':'white', 'color':'black'});
        }
    };

    // access user data
    var userDetails = authStorageAccess.getData('userDetails');

    // check if logged in
    if(userDetails){
        console.log(userDetails);
        $scope.identity = userDetails.name;

        if (userDetails.img){
            $scope.imgLink = userDetails.img;
        }
        else {
            $scope.imgLink = "images/userImage.png";
        }


    }
    else {
        snackbar("Please Login to access this page");
        $state.go("home");
    }



    // request for feed
    $http(
        {
            method: 'GET',
            url: "http://localhost:3000/api/feeds/" + $stateParams.id
        }
    ).then(
        function successCallback(response) {
            var data = response.data;
            if (data.indexOf("Error") !== -1){
                snackbar("A problem has occurred. Please try again.");
                $state.reload();
            }
            else {
                $scope.feed = data[0];
                if($scope.feed.upvotes.indexOf(userDetails.username) !== -1){
                    upvoteActive = false;
                }
                $scope.modUpvoteBtn();
                console.log($scope.feed);
            }
        }
    );

    $scope.commentBtn = function () {
        var comment2 = {
            "comment": $scope.commentInput,
            "author": userDetails.username,
            "img": (userDetails.img)?(userDetails.img):null
        };
        $scope.feed.comments.push(comment2);
        $http(
            {
                method: "POST",
                url: "http://localhost:3000/api/feeds/comment/" + $stateParams.id,
                data: comment2
            }
        ).then(
            function successCallback(response) {
                var data = response.data;
                if (data.indexOf("Error") !== -1){
                    snackbar("A problem has occurred. Please try again.");
                    $scope.feed.comment().splice($scope.feed.indexOf(comment2), 1);
                }
                else {
                    $scope.commentInput = null;
                }

            }
        )

    };

    $scope.upvote = function () {

        if(upvoteActive){
            upvoteActive = false;
            $scope.modUpvoteBtn();
            $http(
                {
                    method: 'POST',
                    url: "http://localhost:3000/api/feeds/upvote/" + $stateParams.id,
                    data:{
                        'user': userDetails.username
                    }
                }
            ).then(
                function successCallback(response){

                    var data = response.data;
                    if (data.indexOf("Error") !== -1){
                        snackbar("A problem has occurred. Please try again.");
                        upvoteActive = true;
                        $scope.modUpvoteBtn();

                    }
                    else {
                        $scope.feed.upvotes.push(userDetails.username);
                    }
            })
        }
        else {
            upvoteActive = true;
            $scope.modUpvoteBtn();
            $http(
                {
                    method: 'POST',
                    url: "http://localhost:3000/api/feeds/downvote/" + $stateParams.id,
                    data:{
                        'user': userDetails.username
                    }
                }
            ).then(
                function successCallback(response){

                    var data = response.data;
                    if (data.indexOf("Error") !== -1){
                        snackbar("A problem has occurred. Please try again.");
                        upvoteActive = false;
                        $scope.modUpvoteBtn();

                    }
                    else {
                        $scope.feed.upvotes.splice($scope.feed.upvotes.indexOf(userDetails.username), 1);
                    }
                })
        }
    };


    // sign out
    $scope.signOut = function () {
        if (userDetails.img){
            gapi.load('auth2', function () {
                gapi.auth2.init();
            });

            try {
                var auth2 = gapi.auth2.getAuthInstance();
                auth2.signOut().then(function () {
                    console.log('User signed out.');
                });
                authStorageAccess.setData("userDetails", "");
                $state.go('home');
                snackbar("Logged Out");
            }
            catch (exp){
                snackbar("An Error Occurred. Please Try Again");
            }

        }
        else {
            authStorageAccess.setData("userDetails", "");
            $state.go('home');
            snackbar("Logged Out");
        }

    };

    // rotate caret
    $scope.rotateCaret = function () {
        if(rotate){
            $(".caret").removeClass("reset");
            $(".caret").addClass("rotate");
            rotate = false;
        }
        else{
            $(".caret").removeClass("rotate");
            $(".caret").addClass("reset");
            rotate = true;
        }
    };

    $scope.setImage = function (comment) {
        if (comment.img){
            return comment.img;
        }
        else {
            return "images/userImage.png"
        }
    }


};


angular.module('myApp').controller('feedController', feedController);