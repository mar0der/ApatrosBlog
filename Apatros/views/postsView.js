define(['mustache'], function (Mustache) {
    function PostsView(selector, data) {
        $.get('templates/posts.html', function (template) {
            var shorterData = JSON.parse(JSON.stringify(data));
            shorterData['posts'].forEach(function (post) {
            post['body'] = post['body'].substr(0,200)+'...';
            });

            var output = Mustache.render(template, shorterData);
            $(selector).html(output);
        })
    }
    return {
        load: function (selector, data) {
            PostsView(selector, data);
        }
    }
});