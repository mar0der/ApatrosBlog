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
    var data = Requester.get(this.baseUrl + '/classes/Book', credentials.getHeaders()).then(
        function (data) {
            data['results'].forEach(function (post) {
                var p = new postModel(post['objectId'],post['title'], post['author'], post['isbn']);
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