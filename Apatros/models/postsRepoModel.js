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
    var data = Requester.get(this.baseUrl + 'classes/Post', credentials.getHeaders()).then(
        function (data) {
            data['results'].forEach(function (post) {
                var p = new postModel(
                    post['objectId'],
    this.postsRepo.posts.length = 0;
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