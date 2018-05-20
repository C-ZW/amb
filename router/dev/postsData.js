function GenerateDate() {
    let counter = 0;
    let userNum = 1;

    return function (num = 10) {
        let result = [];
        for (let i = 0; i < num; i++) {
            result.push({
                user: `${Math.round(Math.random() * userNum)}`,
                postId: `id${counter}`,
                title: `title ${counter}`,
                content: `This is content ${counter}`,
                createdTime: new Date(),
                like: Math.round(Math.random() * 1000),
                dislike: Math.round(Math.random() * 1000),
                popularity: Math.round(Math.random() * 1000)
            });
            counter++;
        }
        return result;
    }
}

module.exports = GenerateDate()(100);

