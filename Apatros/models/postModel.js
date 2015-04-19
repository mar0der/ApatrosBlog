define( function () {

    function Post(id, author, title, body, date, visits) {
        this.id = id;
        this.author = author;
        this.title = title;
        this.body = body;
        this.date = date;
        this.visits = visits;
    }

    return Post;
});