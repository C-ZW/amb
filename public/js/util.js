function MakeFetch(url, method = 'GET') {
    let header = {};
    let m = method.toLowerCase();
    header['method'] = method;
    
    if (m === 'get' || m === 'delete') {

        return function (id, token) {
            if (token !== undefined) {
                header['x-access-token'] = token;
            }

            if (id !== undefined) {
                return fetch(`${url}?id=${id}`, header)
                .then((res) => {
                    return res.json();
                })
            }

            return fetch(`${url}`, header)
                .then((res) => {
                    return res.json();
                })
        }
    } else if (m === 'post' || m === 'put') {
        header['Content-Type'] = 'application/json';

        return function (body, token) {
            if (body === undefined) {
                throw 'body is undefined';
            }

            header['x-access-token'] = token;
            header.body = body;

            return fetch(url, {
                method: method,
                body: JSON.stringify(body),
                headers: header
            })
                .then((res) => {
                    return res.json();
                })
        }
    } else {
        throw 'http method not implement: ' + method;
    }
}