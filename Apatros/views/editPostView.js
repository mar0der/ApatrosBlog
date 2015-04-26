define(['mustache'], function (Mustache) {
    function editPostView(controller, postContainer) {
        $.get('templates/editPost.html', function (template) {
            var post = {
                "title": postContainer.children('.clear > h3').text(),
                "body": postContainer.children('.postBody p').text(),
                "authorId": commentDiv.children('.author').data('id'),
                "authorUsername": commentDiv.children('.author').text(),
                "createdAt": commentDiv.children('.date').text(),
            }
            var output = Mustache.render(template, data);
            $(selector).html(output);
        });
    }
    return {
        loadEditForm: function (controller, container) {
            editPostView(controller, container);
        }
    }
});