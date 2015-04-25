﻿define(['mustache'], function (Mustache) {
    function commentsView(controller, selector, data) {
        $.get('templates/comments.html', function (template) {
            data.results.forEach(function (comment) {
                if ((comment.author.objectId === controller.credentials.getUserId()
                    || controller.isAdmin())
                    && controller.isLogged()) {
                    comment['allowedToEdit'] = true;
                }
            });

            var output = Mustache.render(template, data);
            $(selector).html(output);
        });
    }

    function appendComment(controller, selector, data) {
        $.get('templates/comments.html', function (template) {
            data['allowedToEdit'] = true;
            var output = Mustache.render(template, data);
            $(selector).append(output);
        })
        .then(function() {
                $('#comment-content').val('');
            });
    }

    function loadEditForm(controller, commentDiv) {
        var comment = {
            "commentId": commentDiv.data('id'),
            "content": commentDiv.children('.content').text(),
            "authorId": commentDiv.children('.author').data('id'),
            "authorUsername": commentDiv.children('.author').text(),
            "createdAt": commentDiv.children('.date').text(),
            "isLogged": controller.isLogged()
        }

        $.get('templates/editCommentForm.html', function (template) {
            var output = Mustache.render(template, { 'content': comment.content });
            commentDiv.html(output);
        })
        .then(function () {
            commentDiv.on('click', '.save-edited-comment', function () {
                comment.content = $(this).prev().val();
                controller.model.comments.update(comment.content, comment.commentId)
                    .then(function () {
                        $.get('templates/comment.html', function (template) {
                            var output = Mustache.render(template, comment);
                            commentDiv.html(output);
                        });
                    }, function (error) {
                        controller.noty.error(error.responseJSON.error);
                        controller.noty.error("You are not allowed to edit this comment");
                    });
            });
        });

    }

    function deleteComment(controller, commentDiv) {
        controller.model.comments.delete(commentDiv.data('id'));
        commentDiv.remove()
    }

    return {
        load: commentsView,
        appendComment: appendComment,
        loadEditForm: loadEditForm,
        deleteComment: deleteComment
    }
});