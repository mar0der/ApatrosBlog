define(['ajaxRequesterModel', 'Q', 'credentialsModel', 'lodash', 'postsRepoModel'], function (Requester, Q, credentials, _, postsRepo) {
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

    TagsRepo.prototype.getPostsIdsByTagId = function getPostsIdsByTagId(tagId){
        var query = '?where={"tagId": {"__type": "Pointer", "className": "Tag", "objectId": "' + tagId + '"}}';
        var url = this._serviceUrl + query;
        var defer = Q.defer();
        var postIds = [];

        Requester.get(url, credentials.getHeaders()).then(
            function(data){
                data.results.forEach(function(row){
                    postIds.push(row.postId.objectId);
                });

                defer.resolve(postIds);
            }
        );

        return defer.promise;
    };

    TagsRepo.prototype.getMostFamousTags = function getMostFamousTags(limit){
        return Requester.post(this._baseUrl + 'functions/getMostFamousTags', credentials.getHeaders(), {limit: limit});
    };

    return {
        load: function (baseUrl) {
            return new TagsRepo(baseUrl);
        }
    }
});