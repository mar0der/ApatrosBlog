define(['ajaxRequester', 'config'], function (ajax, config) {

    function Model(baseUrl, ajax) {
        this.books = new Books(baseUrl, ajax);
    }

    var cradentials = (function () {
        var headers = {
            'X-Parse-Application-Id': 'SJQvq4pIgIlI8HlOmTqxeOM2X7u5WgH8ZI1dzttX',
            'X-Parse-REST-API-Key': 'ehSPwJ2s549pLpJ4L9nDwwyqlWJvnS17awuJkGUF',
            'X-Parse-Session-Token': getSessionToken()
        };

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
    }());

    var Books = (function (arguments) {
        function Books(baseUrl, ajax) {
            this._serviceUrl = baseUrl + 'classes/Book';
            this._ajax = ajax;
            this._headers = cradentials.getHeaders();
        }

        Books.prototype.add = function addBook(bookData) {
            return this._ajax.post(this._serviceUrl, this._headers, bookData);
        }

        Books.prototype.getAll = function getAll() {
            return this._ajax.get(this._serviceUrl, this._headers);
        }

        Books.prototype.getById = function getById(objectId) {
            return this._ajax.get(this._serviceUrl + '/' + objectId, this._headers);
        }

        Books.prototype.edit = function edit(objectId, bookData) {
            return this._ajax.put(this._serviceUrl + '/' + objectId, this._headers, bookData);
        }

        Books.prototype.deleteById = function deleteById(bookId) {
            return this._ajax.delete(this._serviceUrl + '/' + bookId, this._headers);
        }

        return Books;
    }());

    return new Model(config.baseUrl, ajax);
});