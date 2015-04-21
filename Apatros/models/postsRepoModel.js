define(['ajaxRequesterModel', 'postModel', 'Q', 'credentialsModel'], function (Requester, postModel, Q, credentials) {
    function PostsRepo(baseUrl) {
        this._serviceUrl = baseUrl + 'classes/Post/';
        this.postsRepo = {
            posts:[]
        };
    }

    PostsRepo.prototype.getPosts = function () {
    var deffer = Q.defer();
    var _this = this;
    this.postsRepo.posts.length = 0;
    var data = Requester.get(this._serviceUrl + '?include=author', credentials.getHeaders()).then(
        function (data) {
            data['results'].forEach(function (post) {
                var p = new postModel(
                    post['objectId'],
                    post['author'].username,
                    post['title'],
                    post['body'],
                    post['createdAt'],
                    post['visits']
                );
                _this.postsRepo.posts.push(p);
            });
            deffer.resolve(_this.postsRepo);
            },
        function(error){
            console.log(error.responseText);
        }
        );
        return deffer.promise;
    };
    PostsRepo.prototype.getPost = function (id) {
        var deffer = Q.defer();
        Requester.get(this._serviceUrl + id + '?include=author', credentials.getHeaders()).then(
            function (post) {
                deffer.resolve(post);
            }, function (error) {
                deffer.reject(error)
            }
        );
        return deffer.promise;
    };

    PostsRepo.prototype.addPost = function (title, body) {
        var defer = Q.defer();
        var data = {
            author: {
                 "__type": "Pointer",
                "className":"_User",
                "objectId": credentials.getUserId()
            },
            title: title,
            body: body,
            visits: 0
        };

        Requester.post(this._serviceUrl, credentials.getHeaders(), data).then(
            function(data){
                defer.resolve(data);
            },
            function(error){
               defer.reject(error);
            }
        );

        return defer.promise;
    };
    PostsRepo.prototype.editPost = function () {
        //TODO
    };
    PostsRepo.prototype.deletePost = function () {
        //TODO
    };

    return {
        load: function (baseUrl) {
            return new PostsRepo(baseUrl);
        }
    }
});