define(['model', 'mustache'], function (model, mustache) {

    var attachCreateBookHandler,
        attachDeleteBookHandler,
        attachEditBookHandler;

    function Controller(model) {
        this._model = model;
    }

    Controller.prototype.loadBooks = function (container) {
        container.load('./templates/posts.html');
//        this._model.books.getAll()
//            .then(function (data) {
//                $.get('./templates/books.html', function (template) {
//                    var output = mustache.render(template, data);
//                    container.html(output);
//                });
//            }, function error(err) {
//                console.log(err);
//            });
    };

    Controller.prototype.loadTags = function (container) {

        container.load('./templates/tags.html');
    };

    Controller.prototype.loadLogin = function (container) {
        container.load('./templates/login.html');
    };

    Controller.prototype.loadRegister = function (container) {
        container.load('./templates/register.html');
    };

    Controller.prototype.loadAddPost = function (container) {
        container.load('./templates/addPost.html');
    };

    Controller.prototype.init = function (container) {
        attachCreateBookHandler.call(this, container);
        attachDeleteBookHandler.call(this, container);
        attachEditBookHandler.call(this, container);

    };

    attachCreateBookHandler = function attachCreateBookHandler(container) {
        var _this = this;
        container.on('click', '#add-book-btn', function (ev) {
            var bookTitle = $('#add-book-title').val();
            $('#add-book-title').val('');
            var bookAuthor = $('#add-book-author').val();
            $('#add-book-author').val('');
            var bookISBN = $('#add-book-isbn').val();
            $('#add-book-isbn').val('');

            if (bookTitle && bookAuthor && bookISBN) {
                var bookObject = {
                    title: bookTitle,
                    author: bookAuthor,
                    isbn: bookISBN
                };
                _this._model.books.add(bookObject)
                    .then(function (responseObj) {
                        var booksContainer = $('#books-container');
                        var bookDiv = $('<div>')
                            .attr('class', 'book')
                            .attr('data-id', responseObj.objectId)
                            .append($('<div>').text(bookTitle))
                            .append($('<div>').text(bookAuthor))
                            .append($('<div>').text(bookISBN))
                            .append($('<button class="edit-book-btn">ed</button>'))
                            .append($('<button class="delete-book-btn">x</button>'));
                        booksContainer.append(bookDiv);
                    }, function error(er) {
                        console.log(er);
                    });
            } else {
                alert('The book title, author and isbn cannot be empty!');
            }
        });
    };

    attachDeleteBookHandler = function attachDeleteBookHandler(container) {
        var _this = this;
        container.on('click', '.delete-book-btn', function (ev) {
            var bookId = $(this).parent().data('id');
            var conf = confirm('Do you want to delete this book');
            if (conf) {
                _this._model.books.deleteById(bookId)
                    .then(function success() {
                        $(ev.target).parent().slideUp();
                    }, function errror(er) {
                        console.log(er);
                    });
            }
        });
    }

    attachEditBookHandler = function attachEditBookHandler(container) {
        var _this = this;
        container.on('click', '.edit-book-btn', function (ev) {
            var bookDiv = $(this).parent();
            var bookId = bookDiv.data('id');
            var bookTitle = $(this).prev().prev().prev().text();
            var bookAuthor = $(this).prev().prev().text();
            var bookISBN = $(this).prev().text();
            var editInputElement1 = $('<input>')
                .val(bookTitle)
                .attr('id', bookId);
            var editInputElement2 = $('<input>')
                .val(bookAuthor)
                .attr('id', bookId);
            var editInputElement3 = $('<input>')
                .val(bookISBN)
                .attr('id', bookId);

            var editButton = $('<button>')
                .text('Save')
                .on('click', function () {
                    var bookData = {
                        title: editInputElement1.val(),
                        author: editInputElement2.val(),
                        isbn: editInputElement3.val()
                    }
                    _this._model.books.edit(bookId, bookData)
                        .then(function success(data) {
                        
                            bookDiv
                                .attr('class', 'book')
                                .attr('data-id', data.objectId)
                                .html($('<div>').text(bookData.title))
                                .append($('<div>').text(bookData.author))
                                .append($('<div>').text(bookData.isbn))
                                .append($('<button class="edit-book-btn">ed</button>'))
                                .append($('<button class="delete-book-btn">x</button>'));
                        }, function error(er) {
                            console.log(er);
                        });
                });
            bookDiv
                .html(editInputElement1)
                .append(editInputElement2)
                .append(editInputElement3)
                .append(editButton);
        });
    }

    return new Controller(model);
});