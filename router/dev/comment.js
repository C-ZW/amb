const router = require('express').Router();
const comments = require('./postsData').comments;

router.get('/api/data/comments', (req, res) => {
    let result = [];

    if (req.query.postId !== undefined) {
        result = comments.filter(item => {
            return item.post_id === req.query.postId;
        });
    }
    res.send(mapToCommonUserView(result));
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