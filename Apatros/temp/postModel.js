define([], function () {
    function PostModel(id, title, body, tags) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.tags = tags;
    }

    return PostModel;
});