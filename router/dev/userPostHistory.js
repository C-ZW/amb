const router = require('express').Router();
const postData = require('./postsData.js');

router.get('/api/data/history', (req, res, next) => {
    const targetPosts = postData.filter(item => {
        return item.user === req.query.user;
    });
    res.send(mapToCreatorView(targetPosts));
});

function mapToCreatorView(posts) {
    return posts.map(post => {
        return {
            title: post.title,
            content: post.content,
            createdTime: post.createdTime,
            like: post.like,
            dislike: post.dislike,
            popularity: post.popularity,
            postId: post.postId
        };
    });
}

module.exports = router;