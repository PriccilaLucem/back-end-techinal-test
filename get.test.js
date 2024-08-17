const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
const { handler } = require('./get'); 

AWS.config.update({ region: 'us-east-1' }); 

jest.mock('./normalizer', () => jest.fn().mockImplementation(event => ({
    method: 'GET',
    pathParameters: event.pathParameters || {},
    querystring: {},
})));

jest.mock('./response', () => jest.fn().mockImplementation((status, body) => ({
    statusCode: status,
    body: JSON.stringify(body),
    headers: {
        'Content-Type': 'application/json',
    },
})));

describe('Lambda Handler', () => {
    beforeEach(() => {
        AWSMock.setSDKInstance(AWS);
    });

    afterEach(() => {
        AWSMock.restore();
    });

    it('should successfully scan all items from DynamoDB', async () => {
        const mockData = {
            Count: 1,
            Items: [
                {
                    id: '1234-5678-9012-3456',
                    example: 'data',
                    created_at: '2024-08-17T15:35:56.000Z', 
                },
            ],
        };
        

        AWSMock.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
            console.log('Mocked DynamoDB scan params:', params);
            callback(null, mockData);
        });

        const event = {}; 

        const result = await handler(event);
        
        const actualBody = JSON.parse(result.body);
        const expectedBody = {
            Count: 1,
            Items: [
                {
                    id: '1234-5678-9012-3456',
                    example: 'data',
                },
            ],
        };
        
        expect(result.statusCode).toBe(200);
        expect(actualBody.Count).toBe(expectedBody.Count);
        expect(actualBody.Items).toHaveLength(expectedBody.Items.length);
        expect(actualBody.Items[0].id).toBe(expectedBody.Items[0].id);
        expect(actualBody.Items[0].example).toBe(expectedBody.Items[0].example);
    }, 30000);
});
