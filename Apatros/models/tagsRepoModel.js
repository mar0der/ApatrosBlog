define(['ajaxRequesterModel', 'tagModel', 'Q', 'credentialsModel'], function (Requester, tagModel, Q, credentials) {
    function TagsRepo(baseUrl) {
        this._baseUrl = baseUrl;
        this._serviceUrl = baseUrl + 'classes/Tag';
    }

    TagsRepo.prototype.addTags = function addTags(tagsText){
        var _this = this;
        var defer = Q.defer();
        var tags = tagsText.split(',');
        var data = {
            requests: []
        };

        tags.forEach(function (value){
            data.requests.push({
                method: 'POST',
                path: _this._serviceUrl,
                body: {
                    tagName: value
                }
            });
        });

        Requester.post(this._baseUrl + 'batch', credentials.getHeaders(), data).then(
            function(data){
                defer.resolve(data);
            },
            function(error){
                defer.reject(error);
            });

        return defer.promise;
    };

    return {
        load: function (baseUrl) {
            return new TagsRepo(baseUrl);
        }
    }
});