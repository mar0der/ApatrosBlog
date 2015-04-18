define(['ajaxRequester', 'postModel', 'Q', 'config', 'model'],
    function (Requester, postModel, Q, config, model) {
    function ModelRepo(baseUrl) {
        this.postsRepo = {
            posts:[]
        };
    }

    ModelRepo.prototype.getPosts = function () {
        var deffer = Q.defer();
        var _this = this;
        var data = Requester.get(config.baseUrl+'classes/Book', config.headers).then(
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

    return {
        load: function (baseUrl) {
            return new ModelRepo(baseUrl);
        }
    }
});