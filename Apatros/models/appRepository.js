define(['postsRepoModel', 'commentsRepoModel'], function (posts, comments) {
    function AppRepo(baseUrl) {
        
        this.posts = posts.load(baseUrl);
        this.comments = comments.load(baseUrl);

    }

    return {
        load: function(baseUrl) {
            return new AppRepo(baseUrl);
        }
    }
})