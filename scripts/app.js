(function() {
    function setupFacebook() {
        $("#login").on("click", function() {
            facebookConnectPlugin.login(["email", "user_friends"], function(response) { // do not retrieve the 'user_likes' permissions from FB - will break the app after April 2015
                if (response) {
                    // contains the 'status' - bool, 'authResponse' - object with 'session_key', 'accessToken', 'expiresIn', 'userID'
                    alert("You are: " + response.status);
                } else {
                    alert("You are not logged in");
                }
            });
        });

        $("#get-login-status").on("click", function() {
            facebookConnectPlugin.getLoginStatus(function(response) {
                if (response.status === "connected") {
                    alert("You are logged in");
                } else {
                    alert("You are not logged in");
                }
            });
        });

        $("#logout").on("click", function() {
            facebookConnectPlugin.logout(function(response) {
                alert("You were logged out");
            });
        });

        $("#get-friends").on("click", function() {
            var listView = $("#friends-list").data("kendoMobileListView");
            listView.showLoading();

            var graphPath = "/me/friends"; // as in https://developers.facebook.com/docs/graph-api/reference/v2.1/ - the friends of the person in FB that are using our app
            var permissions = []; // for example ['user_birthday'] // you can not assign additional permissions in the JS SDK but the readme says otherwise in https://github.com/Wizcorp/phonegap-facebook-plugin#getting-a-users-birthday

            facebookConnectPlugin.api(graphPath, permissions,
                function(response) {
                    alert(JSON.stringify(response));
                    if (response.error) {
                        alert(JSON.stringify(response.error));
                        return;
                    }
                    listView.setDataSource(
                        new kendo.data.DataSource({
                            data: response.data
                        })
                    );
                });
        });
    };

    document.addEventListener("deviceready", function() {
        navigator.splashscreen.hide();
        new kendo.mobile.Application(document.body, {
            layout: "layout"
        });
        setupFacebook();
    });
}());