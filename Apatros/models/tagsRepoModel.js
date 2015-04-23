define(['ajaxRequesterModel', 'tagModel', 'Q', 'credentialsModel'], function (Requester, tagModel, Q, credentials) {
    function TagsRepo(baseUrl) {
        this._baseUrl = baseUrl;
        this._serviceUrl = baseUrl + 'classes/Tag';
    }

    TagsRepo.prototype.addTags = function addTags(tagsText){
        var _this = this;
        var defer = Q.defer();
        var tags = tagsText.split(',');
        var tagsIds = [];
        var checkedTags = 0;
        var batchData = {
            requests: []
        };

        tags.forEach(function (value){
            _this.getTag(value.trim()).then(function(data){
                if(data.results.length){
                    tagsIds.push(data.results[0].objectId);
                }else{
                    batchData.requests.push({
                        method: 'POST',
                        path: _this._serviceUrl,
                        body: {
                            tagName: value.trim()
                        }
                    });
                }
                checkedTags++;
                if(checkedTags == tags.length){
                    Requester.post(_this._baseUrl + 'batch', credentials.getHeaders(), batchData).then(
                        function(data){
                            data.forEach(function(value){
                                tagsIds.push(value.success.objectId);
                            });

                            defer.resolve(tagsIds);
                        }, function(error){
                            defer.reject(error);
                        }
                    );
                }
            });
        });

        return defer.promise;
    };

    TagsRepo.prototype.getTag = function getTag(tagName){
        var defer = Q.defer();
        var data = {
            tagName: tagName
        };

        Requester.get(this._serviceUrl + '?where={"tagName": "' + tagName + '"}', credentials.getHeaders()).then(
            function(data){
                defer.resolve(data);
            },
            function(error){
                defer.reject(error);
            }
        );

        return defer.promise;
    };
    return {
        load: function (baseUrl) {
            return new TagsRepo(baseUrl);
        }
    }
});