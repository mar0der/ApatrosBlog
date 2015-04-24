define( function () {

    function Post(id, author, title, body, date, visits, tags) {
        this.id = id;
        this.author = author;
        this.title = title;
        this.body = body;
        this.date = new Date(date).toDateString();
        this.visits = visits;
        this.tags = tags;
    }

    return Post;
});