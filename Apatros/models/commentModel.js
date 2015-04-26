define([], function () {
    function Comment(id, content, date, author) {
        this.id = id;
        this.date = date;
        this.author = author;
        this.content = content;
    }

    return Comment;
});