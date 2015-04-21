define(['config'], function(config) {
    var headers = config.headers;
    headers['X-Parse-Session-Token'] = getSessionToken();
    
    function getSessionToken() {
        return sessionStorage.getItem('sessionToken');
    }

    function setSessionToken(sessionToken) {
        sessionStorage.setItem('sessionToken', sessionToken);
    }

    function getUsername(username) {
        return sessionStorage.getItem('username');
    }

    function setUsername(sessionToken) {
        sessionStorage.setItem('username', username);
    }

    function getUserId(userId) {
        return sessionStorage.getItem('userId');
    }

    function setUserId(userId) {
        sessionStorage.setItem('userId', userId);
    }

    function getHeaders() {
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