const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
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

    const { data } = normalizeEvent(event);
    
    const id = uuidv4();

    const params = {
        TableName: table,
        Item: {
            id,
            ...data,
            created_at: new Date().toISOString(),
        },
    };

    try {
        await dynamo.put(params).promise();

        console.log({
            message: 'Record has been created',
            data: JSON.stringify(params.Item),
        });

        return response(201, params.Item);
    } catch (err) {
        console.error(err);
        return response(500, 'Something went wrong');
    }
};
