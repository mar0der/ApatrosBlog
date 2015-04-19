define([], function () {
    function Post(id, title, body) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.comments = [];
        this.tags = [];
    }

    Post.prototype.getComments = function () {
        //TODO
    };
    Post.prototype.addComment = function () {
        //TODO
    };
    Post.prototype.deleteComment = function () {
        //TODO
    };
    Post.prototype.editComment = function () {
        //TODO
    };
    Post.prototype.addTag = function () {
        //TODO
    };

    return Post;
});