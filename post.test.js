const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
const { handler } = require('./post');

jest.mock('uuid', () => ({
    v4: jest.fn().mockReturnValue('1234-5678-9012-3456'),
}));

jest.mock('./normalizer', () => jest.fn().mockImplementation(event => ({
    method: 'POST',
    data: { example: 'data' },
    querystring: {},
    pathParameters: {},
})));

jest.mock('./response', () => jest.fn().mockImplementation((status, body) => ({
    statusCode: status,
    body: JSON.stringify(body),
    headers: {
        'Content-Type': 'application/json',
    },
})));

describe('Lambda Handler', () => {
    beforeAll(() => {
        AWS.config.update({
            region: 'us-west-2' 
        });
    });

    beforeEach(() => {
        AWSMock.setSDKInstance(AWS);
    });

    afterEach(() => {
        AWSMock.restore();
    });

    it('should successfully put an item into DynamoDB', async () => {
        jest.setTimeout(10000); 

        AWSMock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
            callback(null, 'success');
        });

        const event = {
            body: JSON.stringify({ example: 'data' }),
        };

        const result = await handler(event);

        expect(result.statusCode).toBe(201);
        expect(JSON.parse(result.body)).toEqual({
            id: '1234-5678-9012-3456',
            example: 'data',
            created_at: expect.any(String),
        });
    });
});
