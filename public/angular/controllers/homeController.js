/**
 * Created by mahim on 25-07-2017.
 */

var homeController = function ($scope, $state, $http, authStorageAccess) {

    //  logged in or not
    $scope.switch = false;

    // switching between signUp and logIn forms
    $scope.toggle = true;

    var rotate = true;

    // <!--open and close side nav-->
    $scope.openNav = function () {
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("main").style.marginLeft = "350px";
        $('#open').css('opacity','0');
        $('#open').css('cursor','default');
    };

    $scope.closeNav = function () {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft= "0";
        $('#open').css('opacity','1');
        $('#open').css('cursor','pointer');
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




    // access user data
    var userDetails = authStorageAccess.getData('userDetails');
    // check if logged in
    if(userDetails){
        $scope.switch = $scope.switch === false;
        console.log(userDetails);
        $scope.identity = userDetails.name;

        if (userDetails.img){
            $scope.imgLink = userDetails.img;
        }
        else {
            $scope.imgLink = "images/userImage.png";
        }


    }

    // reset form
    var clearForm = function () {
        // reset form
        $scope.username = "";
        $scope.loginForm.username.$setUntouched();
        $scope.password = "";
        $scope.loginForm.password.$setUntouched();
        $scope.name = "";
        $scope.signupForm.username.$setUntouched();
        $scope.signupForm.password.$setUntouched();
        $scope.signupForm.name.$setUntouched();
        $scope.email = "";
        $scope.signupForm.email.$setUntouched();
        $scope.dupUsername = false;
        $scope.invalidLogin = false;
    };

    // change form
    $scope.showLoginForm = function () {
        $scope.toggle = true;
        clearForm();
    };
    $scope.showSignupForm = function () {
        $scope.toggle = false;
        clearForm();
    };

    // form validation
    $scope.dupUsername = false;
    $scope.invalidLogin = false;


    // login
    $scope.loginButton = function () {

        // check form validation
        if ($scope.loginForm.$valid) {
            var loginData = {
                "password": $scope.password
            };
            var loginUrl = "http://localhost:3000/api/users/" + $scope.username;

            // POST request for login
            $http({
                method: 'POST',
                url: loginUrl,
                data: loginData
            }).then(
                function successCallback(response) {
                    var data = response.data;

                    if (data.indexOf("DB Error") !== -1){
                        snackbar("A problem has occurred. Please try again.");
                        $state.reload();
                    }
                    else if (data.indexOf("Error") !== -1){
                        $scope.invalidLogin = true;
                        clearForm();
                    }
                    else {

                        // get user details if logged in
                        $http(
                            {
                                method: 'GET',
                                url: loginUrl
                            }
                        ).then(
                            function successCallback(response) {
                                userDetails = response.data[0];
                                authStorageAccess.setData("userDetails", userDetails);
                                $state.go('feeds');
                            }
                        )

                    }

                }
            );
        }
    };

    // sign up
    $scope.signupButton = function () {
        if ($scope.signupForm.$valid) {
            var signupData = {
                "username": $scope.username,
                "password": $scope.password,
                "email": $scope.email,
                "name": $scope.name
            };
            var signupUrl = "http://localhost:3000/api/users";
            $http({
                method: 'POST',
                url: signupUrl,
                data: signupData
            }).then(

                // get information from database
                function successCallback(response) {
                    var data = response.data;

                    if (data.indexOf("DB Error") !== -1){
                        snackbar("A problem has occurred. Please try again.");
                        $scope.dupUsername = false;
                        clearForm();
                    }
                    else if (data.indexOf("unique") !== -1){
                        $scope.dupUsername = true;
                        $scope.password = "";
                        $scope.signupForm.password.$setUntouched();
                    }
                    else {
                        userDetails = signupData;
                        authStorageAccess.setData("userDetails", userDetails);
                        $state.go('feeds');
                    }
                }
            );
        }
    };

    // profile img url
    $scope.gUrl = 'images/google-btn-light.png';

    // initializing google auth2 api
    try {
        if (!$scope.switch) {
            gapi.load('auth2', function () {
                gapi.auth2.init();
            });
        }
    }
    catch(err) {
        snackbar("Unable to load Google API. Please Refresh");
        $scope.gUrl = "images/btn_google_signin_light_disabled_web.png";
        $("#gSignInBtn").css("background-color", "white");
    }

     // google sign in
     $scope.signIn = function() {
        var auth2 = gapi.auth2.getAuthInstance();

        auth2.signIn().then(function (googleUser) {

            var profile = googleUser.getBasicProfile();

            var userDetails = {};

            userDetails.name = profile.getName();
            var email = profile.getEmail();
            userDetails.email = email;
            console.log(userDetails.email);
            userDetails.username = email.slice(0, email.indexOf("@"));
            userDetails.img = profile.getImageUrl();
            authStorageAccess.setData("userDetails", userDetails);

            console.log('User signed in.');
            $state.go('feeds');


        });
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
                $state.reload();
                snackbar("Logged Out");
            }
            catch (exp){
                snackbar("An Error Occurred. Please Try Again");
            }

        }
        else {
            authStorageAccess.setData("userDetails", "");
            $state.reload();
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



};

angular.module('myApp').controller('homeController', homeController);


