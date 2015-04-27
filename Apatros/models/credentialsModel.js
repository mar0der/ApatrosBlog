define(['config'], function (config) {
    var headers = config.headers;
    var masterHeaders = config.masterHeaders;

    function getSessionToken() {
        return localStorage.getItem('sessionToken');
    }

    function setSessionToken(sessionToken) {
        localStorage.setItem('sessionToken', sessionToken);
    }

    function getUsername() {
        return localStorage.getItem('username');
    }

    function setUsername(username) {
        localStorage.setItem('username', username);
    }

    function getUserRole() {
        return localStorage.getItem('userRole');
    }

    function setUserRole(userRole) {
        localStorage.setItem('userRole', userRole);
    }

    function getUserId() {
        return localStorage.getItem('userId');
    }

    function setUserId(userId) {
        localStorage.setItem('userId', userId);
    }
    function getHeaders(master) {

        if (master === 'master') {
            masterHeaders['X-Parse-Session-Token'] = getSessionToken();
            return masterHeaders;
        } else {
            headers['X-Parse-Session-Token'] = getSessionToken();
            return headers;
        }

    }

    function getRememberMe() {
        return localStorage['rememberMe'];
    }

    function setRememberMe() {
        localStorage.setItem('rememberMe', true);
    }

    function clearCredentials() {
        delete localStorage.username;
        delete localStorage.sessionToken;
        delete localStorage.userId;
        delete localStorage.userRole;
        delete localStorage.rememberMe;
    }

    return {
        getSessionToken: getSessionToken,
        setSessionToken: setSessionToken,
        getUsername: getUsername,
        setUsername: setUsername,
        getUserId: getUserId,
        setUserId: setUserId,
        getUserRole: getUserRole,
        setUserRole: setUserRole,
        getHeaders: getHeaders,
        setRememberMe: setRememberMe,
        getRememberMe: getRememberMe,
        clearCredentials: clearCredentials
    }
});