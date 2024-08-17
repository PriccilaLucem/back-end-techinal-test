const AWS = require('aws-sdk');

const normalizeEvent = require('./normalizer');  
const response = require('./response');  

require('dotenv').config();

AWS.config.update({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    }
}); 

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    if (process.env.DEBUG) {
        console.log({
            message: 'Received event',
            data: JSON.stringify(event),
        });
    }

    const table = process.env.TABLE;
    if (!table) {
        throw new Error('No table name defined.');
    }

    const { pathParameters } = normalizeEvent(event);

    const params = {
        TableName: table,
    };

    try {
        let data = {};
        if (pathParameters && pathParameters['sessionsId']) {
            data = await dynamo
                .get({
                    ...params,
                    Key: {
                        id: pathParameters['sessionsId'],
                    },
                })
                .promise();
        } else {
            data = await dynamo.scan(params).promise();
        }

        console.log({
            message: 'Records found',
            data: JSON.stringify(data),
        });

        return response(200, data);
    } catch (err) {
        console.error("Error: ", err.message);
        return response(500, `Something went wrong: ${err.message}`);
    }
};
