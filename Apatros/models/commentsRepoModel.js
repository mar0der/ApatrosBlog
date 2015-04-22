define(['ajaxRequesterModel', 'commentModel', 'Q', 'credentialsModel'], function (ajax, commentModel, Q, credentials) {
    function CommentsRepo(baseUrl) {
        this._serviceUrl = baseUrl + 'classes/Comment';
        this.commentsRepo = {
            comments: []
        };

        CommentsRepo.prototype.add = function add(content, postId) {
            var data = {
                "content": content,
                "author": {
                    "__type": "Pointer",
                    "className": "_User",
                    "objectId": credentials.getUserId()
                },
                "post": {
                    "__type": "Pointer",
                    "className": "Post",
                    "objectId": postId}
            }
            ajax.post(this._serviceUrl, credentials.headers, data)
                .then(function (response) {
                    alert(1);
                }, function (err) {
                    console.log(err);
                });
        }
    }

    return {
        load: function (baseUrl) {
            return new CommentsRepo(baseUrl);
        }
    }
});