define(['mustache'], function (Mustache) {
    function addPostView(container, postData) {
        $.get('templates/addPost.html', function (template) {
            var data = postData || { 'action': 'Add' };
            var output = Mustache.render(template, data);
            container.html(output);
            postTagsHandler(container);
        });
    }

    function loadEditForm(controller, postContainer, container) {
        var data = {
            "action": "Edit",
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
        var tags = [];
        $('.tags .tag a').each(function () {
            tags.push($(this).text().substr(1));
        });

        data['tags'] = tags.join(',') + ',';
        addPostView(container, data);
    }

    function loading(container) {
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

        renderTags({});

        $('#post-tags').off('keyup').on('keyup', renderTags);

        function addTag(tag) {
            tag = tag.trim().toLowerCase();
            if (tag.length && !_.includes(catchedTags, tag)) {
                var tagSpan = $('<span class="tag" title="' + tag + '">' + tag + '<span class="deleteTag" data-index="' + catchedTags.length + '"></span></span>');
                catchedTags.push(tag);
                catchedTagsSpans.push({
                    tagName: tag,
                    tagSpan: tagSpan
                });
                input.before(tagSpan);
            }
        }

        function renderTags(event) {
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
                input.val('');
                isEmptyField = true;
            }
            input.data('tags', catchedTags);
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
        loadEditForm: function (controller, postContainer, container) {
            loadEditForm(controller, postContainer, container);
        },
        postTagsHandler: postTagsHandler,
        loading: loading
    }
});