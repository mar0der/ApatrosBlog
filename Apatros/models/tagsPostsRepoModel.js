define(['ajaxRequesterModel', 'Q', 'credentialsModel'], function (Requester, Q, credentials) {
    function TagsRepo(baseUrl) {
        this._baseUrl = baseUrl;
        this._serviceUrl = baseUrl + 'classes/TagsPosts';
    }

    TagsRepo.prototype.addTagsPosts = function addTagsPosts(tagsIds, postId){
        var _this = this;
        var defer = Q.defer();
        var data = {
            requests: []
        };

        tagsIds.forEach(function (value){
            data.requests.push({
                method: 'POST',
                path: _this._serviceUrl,
                body: {
                    postId: {
                        __type: 'Pointer',
                        className: 'Post',
                        objectId: postId
                    },
                    tagId: {
                        __type: 'Pointer',
                        className: 'Tag',
                        objectId: value
                    }
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