define(['postsRepoModel', 'commentsRepoModel', 'tagsRepoModel', 'tagsPostsRepoModel', 'usersRepoModel'], function (posts, comments, tags, tagsPosts, users) {
    function AppRepo(baseUrl) {

        this.posts = posts.load(baseUrl);
        this.comments = comments.load(baseUrl);
        this.tags = tags.load(baseUrl);
        this.tagsPosts = tagsPosts.load(baseUrl);
        this.users = users.load(baseUrl);

    }

    return {
        load: function (baseUrl) {
            return new AppRepo(baseUrl);
        }
    }
})