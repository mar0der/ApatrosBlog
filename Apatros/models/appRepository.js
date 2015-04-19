define(['postsRepoModel'], function(posts) {
    function AppRepo(baseUrl) {
        
        this.posts = posts.load(baseUrl);

    }

    return {
        load: function(baseUrl) {
            return new AppRepo(baseUrl);
        }
    }
})