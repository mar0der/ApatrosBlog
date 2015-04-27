define(['mustache'], function (Mustache) {
    function editPostView(controller, postContainer, contentContainer) {
        var post = {
            "objectId": postContainer.data('id'),
            "title": postContainer.find('.clear h3').text(),
            "body": postContainer.find('.postBody p').text(),
            "author": {
                "objectId": postContainer.find('.clear a').attr('href').split('/')[2],
                "username": postContainer.find('.clear a').text()
            },
            "visits": postContainer.find('.clear .numberOfViews').text().split(':')[1].trim(),
            "date": postContainer.find('.clear .date').text()
        }

        var tags = $('.tags .tag');
        

        $.get('templates/editPost.html', function (template) {
            var output = Mustache.render(template, post);
            contentContainer.html(output);
        })
            .then(function () {
                contentContainer.on('click', '#save-post-btn', function () {
                    var postForm = $(this).parent();
                    post['body'] = postForm.find('#post-body').val();
                    post['title'] = postForm.find('#post-title').val();
                    controller.model.posts.editPost(post.objectId, post.title, post.body)
                        .then(function () {
                            $.get('templates/post.html', function (template) {
                                var output = Mustache.render(template, post);
                                contentContainer.html(output);
                            });
                        });
                });

            });
    }
    return {
        loadEditForm: function (controller, container, contentContainer) {
            editPostView(controller, container, contentContainer);
        }
    }
});