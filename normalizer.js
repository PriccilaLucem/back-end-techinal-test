const normalizeEvent = event => {
    return {
        method: event.requestContext && event.requestContext.http ? event.requestContext.http.method : 'UNKNOWN',
        data: event.body ? JSON.parse(event.body) : {},
        querystring: event.queryStringParameters || {},
        pathParameters: event.pathParameters || {},
    };
};

module.exports = normalizeEvent;
