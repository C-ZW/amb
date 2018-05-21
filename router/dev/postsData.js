function GenerateDate() {
    let userNum = 1;

    return function (num = 10) {
        let result = [];
        for (let counter = 0; counter < num; counter++) {
            result.push({
                user: `${Math.round(Math.random() * userNum)}`,
                postId: `post_id${counter}`,
                title: `title ${counter}`,
                content: `This is content ${counter}`,
                createdTime: new Date(),
                like: Math.round(Math.random() * 1000),
                dislike: Math.round(Math.random() * 1000),
                popularity: Math.round(Math.random() * 1000)
            });
        }
        return result;
    }
}

function generateComment() {

    return function (num = 10) {
        let result = [];

        for (let counter = 0; counter < num; counter++) {
            result.push({
                comment_id: `comment_id:${counter}`,
                post_id: `post_id${Math.round(Math.random() * 10)}`,
                content: `this is comment ${counter}`,
                created_time: new Date(),
                sequence_number: Math.round(Math.random() * 30)
            });
        }
        return result;
    }
}

module.exports = {
    posts: GenerateDate()(100),
    comments: generateComment()(1000)
};

