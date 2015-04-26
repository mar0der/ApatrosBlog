define(['mustache'], function (Mustache) {
    function addPostView(selector, data) {
        $.get('templates/addPost.html', function (template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
            postTagsHandler($(selector));
        });
    }

    function loading(container){
        container.empty();
        container.noty({
            text: 'Loading...',
            type: 'information'
        });
    }

    function postTagsHandler(container) {
        var catchedTags = [];
        var catchedTagsSpans = [];
        var input = $('#post-tags');
        var isEmptyField = true;

        input.data('tags', []);
        $('#tags-wrapper').off('click').on('click', function () {
            $(this).children('input').focus();
        });
        $('#post-tags').off('blur').on('blur', function () {
            addTag($(this).val());
            $(this).val('');
        });
        $('#post-tags').off('keyup').on('keyup', function (event) {
            var value = input.val();
            var tags = value.split(',');
            var backSpaceCode = 8;
            if (event.keyCode === backSpaceCode && isEmptyField) {
                var lastTagIndex = _.findLastIndex(catchedTags);
                deleteTagByIndex(lastTagIndex, true);
            }

            if (!input.val().length) {
                isEmptyField = true;
            } else {
                isEmptyField = false;
            }
            if (tags.length > 1) {
                tags.forEach(function (tag) {
                    addTag(tag);
                });
                $(this).val('');
                isEmptyField = true;
            }
            input.data('tags', catchedTags);
        });

        function addTag(tag) {
            tag = tag.trim().toLowerCase();
            if (tag.length && !_.includes(catchedTags, tag)) {
                var tagSpan = $('<span class="tag" title="' + tag + '">' + tag + '<span class="deleteTag" data-index="' + catchedTags.length + '">x</span></span>');
                catchedTags.push(tag);
                catchedTagsSpans.push({
                    tagName: tag,
                    tagSpan: tagSpan
                });
                input.before(tagSpan);
            }
        }
        function deleteTagByIndex(index, backSpace) {
            if (catchedTags.length > 0) {
                if (backSpace) {
                    input.val(catchedTags[index]);
                }
                catchedTagsSpans.forEach(function (row) {
                    if (row.tagName == catchedTags[index]) {
                        row.tagSpan.remove();
                        delete row;
                    }
                });
                delete catchedTags[index];
                input.data('tags', catchedTags);
            }
        }
        container.on('click', '.deleteTag', function () {
            var tagIndex = $(this).data('index');
            deleteTagByIndex(tagIndex);
        });

    }

    return {
        load: function (selector, data) {
            addPostView(selector, data);
        },
        postTagsHandler: postTagsHandler,
        loading: loading
    }
});