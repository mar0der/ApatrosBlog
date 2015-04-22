define(['config'], function(config) {
    var headers = config.headers;
    
    function getSessionToken() {
        return sessionStorage.getItem('sessionToken');
    }

    function setSessionToken(sessionToken) {
        sessionStorage.setItem('sessionToken', sessionToken);
    }

    function getUsername() {
        return sessionStorage.getItem('username');
    }

    function setUsername(username) {
        sessionStorage.setItem('username', username);
    }

    function getUserId() {
        return sessionStorage.getItem('userId');
    }

    function setUserId(userId) {
        sessionStorage.setItem('userId', userId);
    }

    function getHeaders() {
        headers['X-Parse-Session-Token'] = getSessionToken();
        return headers;
    }

    return {
        getSessionToken: getSessionToken,
        setSessionToken: setSessionToken,
        getUsername: getUsername,
        setUsername: setUsername,
        getUserId: getUserId,
        setUserId: setUserId,
        getHeaders: getHeaders
    }
});