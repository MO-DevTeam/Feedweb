/**
 * Created by mahim on 28-07-2017.
 */

var feedsController = function ($scope, $state, $http, authStorageAccess) {

    // tags
    $scope.tags = ['All', 'Technology', 'Sports', 'Art', 'Food', 'Health', 'Gaming', 'Web', 'Android', 'iOS', 'Windows'];

    // feeds variable
    $scope.feeds = [];

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

    // request all feeds
    $http(
        {
            method: "GET",
            url: "https://feedweb.herokuapp.com/api/feeds"
        }
    ).then(
        function successCallback(response) {
            if (response.data.indexOf("Error") !== -1){
                snackbar("A problem has occurred. Please try again.");
                $state.reload();
            }
            else {
                $scope.feeds = response.data;
                $scope.feedsCopy = $scope.feeds.slice(0);
            }
        }
    );

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


    // filter feeds by tag
    $scope.filterFeeds  = function (tag) {
        $scope.feeds = $scope.feedsCopy.slice(0);
        if (tag !== "All"){
            var len = $scope.feeds.length;
            for (var i = 0; i < len; i++){
                if ($scope.feeds[i].tags.indexOf(tag) === -1){
                    $scope.feeds.splice(i, 1);
                    i--;
                    len--;
                }
            }
        }
    };



};

angular.module('myApp').controller('feedsController', feedsController);