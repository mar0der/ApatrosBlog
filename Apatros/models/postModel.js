define( function () {

    function Post(id, title, body) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.comments = [];
        this.tags = [];
    }

    return Post;
});