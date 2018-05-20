const router = require('express').Router();
const postData = require('./postsData.js');

router.get('/api/data/posts', (req, res, next) => {
    let result = postData;
    let pageSize = 30;

    if (req.query.page !== undefined) {
        let page = parseInt(req.query.page);
        if (isNaN(page)) {
            res.send('page must be number');
        }
        result = postData.slice((page - 1) * pageSize, page * pageSize);
    }

    res.send(result.map(mapToCommentUserView));
});

router.get('/api/data/post', (req, res, next) => {
    const tagetPost = postData.find(item => {
        return item.postId === req.query.id;
    });
    res.send(mapToCommentUserView(tagetPost));
});

function mapToCommentUserView(post) {
    return {
        title: post.title,
        content: post.content,
        createdTime: post.createdTime
    }
}

module.exports = router;