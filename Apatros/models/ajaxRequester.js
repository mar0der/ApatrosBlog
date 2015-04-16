define(['Q'], function (Q) {

    var makePost,
        makeGet,
        makePut,
        makeDelete,
        makeRequest;

    function AjaxRequester() {
        this.post = makePost;
        this.get = makeGet;
        this.put = makePut;
        this.delete = makeDelete;
    }

    makeRequest = function (url, headers, method, data) {
        var defer = Q.defer();
        $.ajax({
            'url': url,
            'headers': headers,
            'method': method,
            'data': JSON.stringify(data) || undefined,
            'dataType': 'json',
            'contentType': 'application/JSON',
            'success': function (returnedData) {
                defer.resolve(returnedData);
            },
            'error': function (returnedData) {
                defer.reject(returnedData);
            }
        });
        return defer.promise;
    }

    makePost = function makePost(url, headers, data) {
        return makeRequest(url, headers, 'POST', data);
    }

    makeGet = function makeGet(url, headers) {
        return makeRequest(url, headers, 'GET');
    }

    makePut = function makePut(url, headers, data) {
        return makeRequest(url, headers, 'PUT', data);
    }

    makeDelete = function makeDelete(url, headers) {
        return makeRequest(url, headers, 'DELETE', null);
    }

    return new AjaxRequester();

});

