define( function () {

    function Post(id, author, title, body, date, visits) {
        this.id = id;
        this.author = author;
        this.title = title;
        this.body = body;
        this.date = new Date(date).toDateString();
        this.visits = visits;
    }

    return Post;
});