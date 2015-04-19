define(['config'], function(config) {
    var headers = config.headers;
    headers['X-Parse-Session-Token'] = getSessionToken();
    
    function getSessionToken() {
        sessionStorage.getItem('sessionToken');
    }

    function setSessionToken(sessionToken) {
        sessionStorage.setItem('sessionToken', sessionToken);
    }

    function getUsername(sessionToken) {
        sessionStorage.getItem('username');
    }

    function setUsername(sessionToken) {
        sessionStorage.setItem('username', sessionToken);
    }

    function getHeaders() {
        return headers;
    }

    return {
        getSessionToken: getSessionToken,
        setSessionToken: setSessionToken,
        getUsername: getUsername,
        setUsername: setUsername,
        getHeaders: getHeaders
    }
});