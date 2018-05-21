const router = require('express').Router();
const comments = require('./postsData').comments;

router.get('/api/data/comments', (req, res) => {
    let result = [];

    if (req.query.postId !== undefined) {
        result = comments.filter(item => {
            return item.post_id === req.query.postId;
        });
    }
    res.send(result);
});

module.exports = router;