const router = require('express').Router();
const postData = require('./postsData.js').comments;

router.get('/api/data/history/comments', (req, res, next) => {
    const targetPosts = postData.filter(item => {
        return item.user === req.query.user;
    });
    res.send(mapToCommonUserView(targetPosts));
});

function mapToCommonUserView(comments) {
    if(comments === undefined) {
        return {};
    }

    return comments.map(comment => {
        return {
            comment_id: comment.comment_id,
            post_id: comment.post_id,
            content: comment.content,
            created_time: comment.created_time,
            sequence_number: comment.sequence_number
        }
    })
}

module.exports = router;