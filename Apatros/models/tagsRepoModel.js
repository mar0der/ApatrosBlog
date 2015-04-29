define(['ajaxRequesterModel', 'tagModel', 'Q', 'credentialsModel'], function (Requester, tagModel, Q, credentials) {
    function TagsRepo(baseUrl) {
        this._baseUrl = baseUrl;
        this._serviceUrl = baseUrl + 'classes/Tag';
    }

    TagsRepo.prototype.addTags = function addTags(tags) {
        var _this = this;
        var defer = Q.defer();
        var tagsIds = [];
        var checkedTags = 0;
        var batchData = {
            requests: []
        };
        var tagsCnt = 0;
        tags.forEach(function () {
            tagsCnt++;
        });
        if(!tagsCnt){
            defer.resolve([]);
        }
        tags.forEach(function (value) {
            _this.getTag(value.trim())
                .then(function (data) {
                    if (data.results.length) {
                        tagsIds.push(data.results[0].objectId);
                    } else {
                        batchData.requests.push({
                            method: 'POST',
                            path: _this._serviceUrl,
                            body: {
                                tagName: value.trim()
                            }
                        });
                    }
                    checkedTags++;
                    if (checkedTags == tagsCnt) {
                        Requester.post(_this._baseUrl + 'batch', credentials.getHeaders(), batchData)
                            .then(
                                function (data) {
                                    data.forEach(function (value) {
                                        tagsIds.push(value.success.objectId);
                                    });
                                    defer.resolve(tagsIds);
                                }, function (error) {
                                    console.log("vrashta");
                                    defer.reject(error);
                                }
                            );
                    }
                });
        });

        return defer.promise;
    };

    TagsRepo.prototype.getTag = function getTag(tagName) {
        return Requester.get(this._serviceUrl + '?where={"tagName": "' + tagName + '"}', credentials.getHeaders());
    };
    return {
        load: function (baseUrl) {
            return new TagsRepo(baseUrl);
        }
    }
});