define(['ajaxRequesterModel', 'postModel', 'postDateModel', 'Q', 'credentialsModel'],
    function (Requester, postModel, postDateModel, Q, credentials) {
    function PostsRepo(baseUrl) {
        this._serviceUrl = baseUrl + 'classes/Post/';
        this._baseUrl = baseUrl;
        this.postsRepo = {
            posts:[]
        };
        this.postsDatesRepo = {
            dates:[]
        }
    }

    PostsRepo.prototype.getPosts = function (query) {
        var deffer = Q.defer(),
            _this = this,
            url = this._serviceUrl + '?include=author&order=-createdAt';

        if (query) {
            url += query;
        }
        this.postsRepo.posts.length = 0;
        Requester.get(url, credentials.getHeaders()).then(
            function (data) {
                data['results'].forEach(function (post) {
                    var p = new postModel(
                        post['objectId'],
                        post['author'],
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

    PostsRepo.prototype.getPostsDates = function (query) {
        var deffer = Q.defer(),
            _this = this;

        this.postsDatesRepo.dates.length = 0;
        Requester.get(_this._serviceUrl + '?keys=createdAt', credentials.getHeaders()).then(
            function (data) {
                data['results'].forEach(function (postDate) {
                    var d = new postDateModel(
                        postDate['createdAt']
                    );
                    _this.postsDatesRepo.dates.push(d);
                });
                deffer.resolve(_this.postsDatesRepo);
            },
            function(error){
                console.log(error.responseText);
            }
        );
        return deffer.promise;
    };

    PostsRepo.prototype.getArchiveByPeriod = function (date) {
        var _this = this,
            query,
            minDate = new Date(date).toISOString(),
            maxDate = new Date(date);
            maxDate.setDate(maxDate.getDate() + 1);
            maxDate = new Date(maxDate).toISOString();

        query = '&where={"createdAt":' +
                '{"$gte":"'+minDate+'\",' +
                '"$lte":"'+maxDate+'\"}}';

        return _this.getPosts(query);
    };
        
    PostsRepo.prototype.getPost = function (id) {
        var deffer = Q.defer();
        var data = {
            'postId': id
        };
        Requester.post(this._baseUrl + 'functions/getPostById', credentials.getHeaders(), data).then(
            function (response) {
                var post = response.result.post;
                var p = new postModel(
                    post['objectId'],
                    post['author'],
                    post['title'],
                    post['body'],
                    post['createdAt'],
                    post['visits'],
                    response.result.tags
                );
                deffer.resolve(p);
            }, function (error) {

                deffer.reject(error);
            }
        );
        return deffer.promise;
    };

    PostsRepo.prototype.addPost = function (title, body) {
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

        return Requester.post(this._serviceUrl, credentials.getHeaders(), data);
    };

    PostsRepo.prototype.getPostsByIds = function getPostsByIds(postIds){
        var url = this._baseUrl + '/functions/getPostsByIds';
        var data = {
            postIds: postIds
        };
        var defer = Q.defer();
        var result = {
            posts: []
        };
        Requester.post(url, credentials.getHeaders(), data).then(
            function(data){
                data.result.forEach(function(post){
                    var p = new postModel(
                        post['objectId'],
                        post['author'].username,
                        post['title'],
                        post['body'],
                        post['createdAt'],
                        post['visits']
                    );
                    result.posts.push(p);
                });
                defer.resolve(result);
            },
            function(error){
                console.log('error');
                defer.reject(error);
            }
        );

        return defer.promise;
    };

    PostsRepo.prototype.editPost = function (id, title, body) {
        var data = {
            title: title,
            body: body
         };

        return Requester.put(this._serviceUrl + id, credentials.getHeaders(), data);
    };

    PostsRepo.prototype.deletePost = function (id) {
        return Requester.delete(this._serviceUrl + id, credentials.getHeaders());
    };

    return {
        load: function (baseUrl) {
            return new PostsRepo(baseUrl);
        }
    }
});