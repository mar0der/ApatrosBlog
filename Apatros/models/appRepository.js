define(['postsRepoModel', 'commentsRepoModel', 'tagsRepoModel', 'tagsPostsRepoModel'], function (posts, comments, tags, tagsPosts) {
    function AppRepo(baseUrl) {
        
        this.posts = posts.load(baseUrl);
        this.comments = comments.load(baseUrl);
        this.tags = tags.load(baseUrl);
        this.tagsPosts = tagsPosts.load(baseUrl);

    }

    return {
        load: function(baseUrl) {
            return new AppRepo(baseUrl);
        }
    }
})