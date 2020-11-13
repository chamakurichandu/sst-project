// var poolData = {
//     UserPoolId: 'ap-south-1_bZY6c6b7b',
//     ClientId: '5bn4fal134kkbnipe6pj3s07s2',
//     Storage: new AmazonCognitoIdentity.CookieStorage({ domain: ".localhost" })
// };

window.poolData = {};

var config = {
    //URL: 'https://kmfjpm1167.execute-api.ap-south-1.amazonaws.com/dev',
    URL: 'https://kmfjpm1167.execute-api.ap-south-1.amazonaws.com/v1',
    DOMAIN: '.localhost', //used for cookie
    POST_AUTH: '/',
    ALERT_TIMEOUT: 10000,
    ACCESS_TOKEN: 'AccessToken',
    ID_TOKEN: 'IdToken',
    CALLBACK: 'http://localhost:8080/callback.html',

    ORG_ID: 3,
    EVENT_ID: 4
};

window.config = config;

var VEApp = window.VEApp || {};
(function scopeWrapper($) {

    VEApp.fetchEvent = function (orgId, eventId) {
        $.ajax({
            url: config.URL + "/org/" + orgId + "/event/" + eventId,
            dataType: 'json',
            success: function (res) {
                window.poolData.UserPoolId = res.response.user_pool_id;
                window.poolData.ClientId = res.response.user_pool_client_id;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("error" + errorThrown);
                $(".alert-danger").show();
                setTimeout(function () {
                    $(".alert-danger").hide();
                }, config.ALERT_TIMEOUT);
            }
        });
    };

    VEApp.getUserPool = function () {
        if (window.userPool == null || window.userPool == undefined) {
            window.userPool = new AmazonCognitoIdentity.CognitoUserPool(window.poolData);
        }
        return window.userPool;
    };

    VEApp.login = function (username, password) {
        var userPool = VEApp.getUserPool();
        var authenticationData = {
            Username: username,
            Password: password
        };

        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
        var userData = {
            Username: username,
            Pool: userPool,
            Storage: new AmazonCognitoIdentity.CookieStorage({ domain: window.config.DOMAIN })
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        VEApp.cognitoUser = cognitoUser;

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                console.log(result);
                var accesstoken = result.getAccessToken().getJwtToken();
                var idToken = result.getIdToken().getJwtToken();
                Cookies.set(config.ACCESS_TOKEN, accesstoken);
                Cookies.set(config.ID_TOKEN, idToken);

                window.location = config.POST_AUTH;
            },
            onFailure: function (err) {
                console.log(err)
                $(".alert-danger").show();
                $("#error-message").text(err.message);
                setTimeout(function () {
                    $(".alert-danger").hide();
                }, config.ALERT_TIMEOUT);
            },
            mfaRequired: function (codeDeliveryDetails) {
                // MFA is required to complete user authentication.
                // Get the code from user and call
                cognitoUser.sendMFACode(mfaCode, this)
            },

            newPasswordRequired: function (userAttributes, requiredAttributes) {
                // User was signed up by an admin and must provide new
                // password and required attributes, if any, to complete
                // authentication.

                // the api doesn't accept this field back
                delete userAttributes.email_verified;

                // store userAttributes on global variable
                sessionUserAttributes = userAttributes;
                console.log(sessionUserAttributes);
                console.log(cognitoUser);

                window.location = '/newpassword.html#' + username;


            }
        });

        // ... handle new password flow on your app
        // handleNewPassword(newPassword) {
        //   cognitoUser.completeNewPasswordChallenge(newPassword, sessionUserAttributes);
        // }
    };

    VEApp.newPassword = function () {
        VEApp.cognitoUser.completeNewPasswordChallenge(newPassword, sessionUserAttributes, {
            onSuccess: function (result) {
                console.log(result);
                var accesstoken = result.getAccessToken().getJwtToken();
                var idToken = result.getIdToken().getJwtToken();
                Cookies.set(config.ACCESS_TOKEN, accesstoken);
                Cookies.set(config.ID_TOKEN, idToken);

                window.location = config.POST_AUTH;
            },
            onFailure: function (err) {
                console.log(err)
                $(".alert-danger").show();
                $("#error-message").text(err.message);
                setTimeout(function () {
                    $(".alert-danger").hide();
                }, config.ALERT_TIMEOUT);
            }
        });
    };

    VEApp.logout = function () {
        var userPool = VEApp.getUserPool();

        var cognitoUser = userPool.getCurrentUser();
        if (cognitoUser != null && cognitoUser != undefined) {
            cognitoUser.signOut();
        }

        Cookies.remove(config.ID_TOKEN);
        Cookies.remove(config.ACCESS_TOKEN);

        window.location = '/authentication-signup-cover.html';
    };

    VEApp.signup = function () {
        var userPool = VEApp.getUserPool();

        var username = $('#email').val();
        var password = $('#password').val();
        var email = new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: 'email',
            Value: $('#email').val()
        });

        var userPool = VEApp.getUserPool();

        userPool.signUp(username, password, [email], null, function (err, result) {
            if (err) {
                console.log(err);
                $(".alert-danger").show();
                $("#error-message").text(err.message);
                setTimeout(function () {
                    $(".alert-danger").hide();
                }, config.ALERT_TIMEOUT);
            } else {
                window.location = 'authentication-email-verification-cover.html#' + username;
            }
        });

    };

    VEApp.confirm = function () {
        var username = location.hash.substring(1);
        var userPool = VEApp.getUserPool();

        var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
            Username: username,
            Pool: userPool
        });
        console.log(cognitoUser);

        cognitoUser.confirmRegistration($('#code').val(), true, function (err, results) {
            if (err) {
                console.log(err);
                $(".alert-danger").show();
                $("#error-message").text(err.message);
                setTimeout(function () {
                    $(".alert-danger").hide();
                }, config.ALERT_TIMEOUT);
            } else {
                alert('success')
                window.location = 'index.html';
            }
        });
    };

    VEApp.newPasswordRequired = function () {
        var username = location.hash.substring(1);
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
            Username: username,
            Pool: userPool
        });
        cognitoUser.completeNewPasswordChallenge($('#newpassword').val(), {
            onSuccess: function (result) {
                console.log(result);
                var accesstoken = result.getAccessToken().getJwtToken();
                var idToken = result.getIdToken().getJwtToken();
                Cookies.set(config.ACCESS_TOKEN, accesstoken);
                Cookies.set(config.ID_TOKEN, idToken);
                window.location = config.POST_AUTH;
            },
            onFailure: function (err) {
                console.log(err)
                $(".alert-danger").show();
                $("#error-message").text(err.message);
                setTimeout(function () {
                    $(".alert-danger").hide();
                }, config.ALERT_TIMEOUT);
            }
        });
    };

    VEApp.resend = function () {
        // var username = $('#email').val();
        var username = location.hash.substring(1);

        var userPool = VEApp.getUserPool();

        var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
            Username: username,
            Pool: userPool
        });

        cognitoUser.resendConfirmationCode(function (err) {
            if (err) {
                console.log(err);
                $(".alert-danger").show();
                $("#error-message").text(err.message);
                setTimeout(function () {
                    $(".alert-danger").hide();
                }, config.ALERT_TIMEOUT);
            } else {
                window.location = 'authentication-email-verification-cover.html#' + username;
            }
        })
    };

    VEApp.sendCodeResetPass = function () {
        var username = $('#email').val();
        // var username = location.hash.substring(1);

        var userPool = VEApp.getUserPool();

        var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
            Username: username,
            Pool: userPool
        });

        cognitoUser.resendConfirmationCode(function (err) {
            if (err) {
                console.log(err);
                $(".alert-danger").show();
                $("#error-message").text(err.message);
                setTimeout(function () {
                    $(".alert-danger").hide();
                }, config.ALERT_TIMEOUT);
            } else {
                alert('code sent to mail')
                window.location = '/authentication-reset-password-code.html#' + username;
            }
        })
    };


    VEApp.confirmPassword = function () {
        // var username = $('#email').val();
        var userPool = VEApp.getUserPool();

        var username = location.hash.substring(1);

        var code = $('#code').val();
        var newpassword = $('#password').val();

        var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
            Username: username,
            Pool: userPool
        });
        // call forgotPassword on cognitoUser

        cognitoUser.confirmPassword(code, newpassword, {
            onSuccess: function (result) {
                alert('success');
                // var accesstoken = result.getAccessToken().getJwtToken();
                // var idToken = result.getIdToken().getJwtToken();
                // Cookies.set(config.ACCESS_TOKEN, accesstoken);
                // Cookies.set(config.ID_TOKEN, idToken);
                window.location = '/authentication-signin-cover.html';

            },
            onFailure: function (err) {
                console.log(err)
                $(".alert-danger").show();
                $("#error-message").text(err.message);
                setTimeout(function () {
                    $(".alert-danger").hide();
                }, config.ALERT_TIMEOUT);
            }
        });
    };

    VEApp.forgotPassword = function () {
        var userPool = VEApp.getUserPool();
        var username = $('#email').val();

        // var username = location.hash.substring(1);
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
            Username: username,
            Pool: userPool
        });
        cognitoUser.forgotPassword({
            onSuccess: function (result) {
                console.log(result);
                $('.modal-body').html("Please check your email. Detailed instructions sent to reset password.");
                $('#retrybutton').hide();
                $('#staticBackdrop').modal('show');
                // alert('success');
                // window.location = '/authentication-reset-password-code.html#'+username;
            },
            onFailure: function (err) {
                console.log(err)
                $('.modal-body').html(err.message);
                $('#retrybutton').show();
                $('#submitbutton').hide();
                $('#staticBackdrop').modal('show');
                // $(".alert-danger").show();
                // $("#error-message").text(err.message);
                // setTimeout(function () {
                //     $(".alert-danger").hide();
                // }, config.ALERT_TIMEOUT);
            }
        });
    };

    VEApp.signInUserSession = function (authResult) {
        //var pool = window.VEApp.getUserPool();
        //var cognitoUser = pool.getCurrentUser();
        //var signInUserSession = cognitoUser.getCognitoUserSession(authResult);
        //cognitoUser.setSignInUserSession(signInUserSession);
        console.log(authResult);
        Cookies.set(config.ID_TOKEN, authResult.IdToken);
        Cookies.set(config.ACCESS_TOKEN, authResult.AccessToken);
    };



    VEApp.ping = function () {
        var tk = Cookies.get(config.ID_TOKEN);

        //var pool = window.VEApp.getUserPool();
        //var cognitoUser = pool.getCurrentUser();
        //var tk = cognitoUser.getIdToken().getJwtToken();
        $.ajax({
            url: config.URL + "/ping",
            headers: { "Authorization": tk },
            dataType: 'text',
            success: function () {
                $(".alert-success").show();
                setTimeout(function () {
                    $(".alert-success").hide();
                }, config.ALERT_TIMEOUT);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("error" + errorThrown);
                $(".alert-danger").show();
                setTimeout(function () {
                    $(".alert-danger").hide();
                }, config.ALERT_TIMEOUT);
            }
        });
    };
    // VEApp.ping = function () {
    //     var pool = window.VEApp.getUserPool();
    //     var cognitoUser = pool.getCurrentUser();

    //     if (cognitoUser == null || cognitoUser == undefined) {
    //         $(".alert-danger").show();
    //                     setTimeout(function () {
    //                         $(".alert-danger").hide();
    //                     }, config.ALERT_TIMEOUT);

    //                     $("#login-nav").show();
    //                     $("#logout-nav").hide();
    //     } else {
    //         $("#login-nav").show();
    //         $("#logout-nav").hide();


    //         cognitoUser.getSession(function (err, session) {
    //             if (err) {
    //                 alert(err.message || JSON.stringify(err));
    //                 return;
    //             }
    //             console.log('session validity: ' + session.isValid());
    //             console.log('session id token:' + session.getIdToken().getJwtToken());

    //             var tk = session.getIdToken().getJwtToken();
    //             $.ajax({
    //                 url: config.URL + "/ping",
    //                 headers: { "Authorization": tk },
    //                 dataType: 'text',
    //                 success: function () {
    //                     $(".alert-success").show();
    //                     setTimeout(function () {
    //                         $(".alert-success").hide();
    //                     }, config.ALERT_TIMEOUT);
    //                 },
    //                 error: function (XMLHttpRequest, textStatus, errorThrown) {
    //                     console.log("error" + errorThrown);
    //                     $(".alert-danger").show();
    //                     setTimeout(function () {
    //                         $(".alert-danger").hide();
    //                     }, config.ALERT_TIMEOUT);
    //                 }
    //             });
    //         });
    //     }
    //};





}(jQuery));

$(document).ready(function () {
    window.VEApp.fetchEvent(window.config.ORG_ID, window.config.EVENT_ID);


    $('.alert').click(function () {
        $(this).fadeOut();
    });
    $('.alert').hide();



    var idToken = Cookies.get('IdToken');
    if (idToken == null) {
        console.log("auth nav");
        $("#auth-nav").hide();
    } else {
        console.log("UNauth nav");
        $("#unauth-nav").hide();
    }
});