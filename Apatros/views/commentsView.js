define(['mustache'], function (Mustache) {
    function CommentsView(selector, data) {
        $.get('templates/comments.html', function(template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        });
    }

    function AppendComment(selector, data) {
        $.get('templates/comments.html', function(template) {
            var output = Mustache.render(template, data);
            $(selector).append(output);
        });
    }

    return {
        load: function (selector, data) {
            CommentsView(selector, data);
        },
        appendComment: function(selector, data) {
            AppendComment(selector, data);
        }
    }
});