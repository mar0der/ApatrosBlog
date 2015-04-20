define(['ajaxRequesterModel', 'postModel', 'Q', 'credentialsModel'], function (Requester, postModel, Q, credentials) {
    function PostsRepo(baseUrl) {
        this.baseUrl = baseUrl;
        this.postsRepo = {
            posts:[]
        };
    }

    PostsRepo.prototype.getPosts = function () {
    var deffer = Q.defer();
    var _this = this;
    this.postsRepo.posts.length = 0;
    var data = Requester.get(this.baseUrl + 'classes/Post?include=author', credentials.getHeaders()).then(
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
            }
        );
        return deffer.promise;
    };
    PostsRepo.prototype.getPost = function (id) {
        var deffer = Q.defer();
        var post = Requester.get(this.baseUrl + 'classes/Post/' + id, credentials.getHeaders()).then(
            function (post) {
                deffer.resolve(post);
            }, function (error) {
                deffer.reject(error)
            }
        );
        return deffer.promise;
    };
    PostsRepo.prototype.addPost = function () {
        //TODO
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