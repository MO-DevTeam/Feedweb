/**
 * Created by Admin on 04-Aug-17.
 */


var newFeedController = function ($scope, $state, $http, authStorageAccess) {


    var rotate = true;

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

    // tags for search
    $scope.tagRefine = ['Technology', 'Sports', 'Art', 'Food', 'Health', 'Gaming', 'Web', 'Android', 'iOS', 'Windows'];
    // added tags
    $scope.addedTags = [];

    // add Tag
    $scope.addTag = function (tag) {

        $scope.addedTags.push(tag);
        $scope.tagRefine.splice($scope.tagRefine.indexOf(tag), 1);
        document.getElementById("tagInput").value = "";
        $scope.searchTag = "";
    };

    // remove Tag
    $scope.removeTag = function (tag) {
        $scope.tagRefine.push(tag);
        $scope.addedTags.splice($scope.addedTags.indexOf(tag), 1);
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

    // hover effect on profile
    $('#MainProfileInfo').mouseenter(function () {
        $('#mainUserInfo').css('color','white')
    });
    $('#MainProfileInfo').mouseleave(function () {
        $('#mainUserInfo').css('color','dimgrey')
    });


    $scope.post = function () {

        var feedData = {
            "title": $scope.title,
            "content": $scope.content,
            "author": userDetails.username,
            "tags": $scope.addedTags
        };

        $http(
            {
                method: 'POST',
                url: "http://localhost:3000/api/feeds",
                data: feedData
            }
        ).then(
            function successCallback(response) {
                var data = response.data;
                if (data.indexOf("Error") !== -1){
                    snackbar("A problem has occurred. Please try again.");
                }
                else {
                    snackbar("Feed Added");
                    $state.go('feeds');
                }
            }
        )
    };



};

angular.module('myApp').controller('newFeedController', newFeedController);