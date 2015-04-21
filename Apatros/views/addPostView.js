define(['mustache'], function (Mustache) {
    function addPostView(selector, data) {
        $.get('templates/addPost.html', function (template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        });
    }

    function loading(container){
        container.empty();
        container.noty({
            text: 'Loading...',
            type: 'information'
        });
    }

    return {
        load: function (selector, data) {
            addPostView(selector, data);
        },
        loading: loading
    }
});