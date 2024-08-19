# Deploying the application

## GET 

- RUN npm install to install the dependencies
- Change the name of the get archive to index.js
- ZIP index.js, normalizer.js, response.js and the node_modules
- Upload the zip archive in lambda

## POST

- RUN npm install to install the dependencies
- Change the name of the post archive to index.js
- ZIP index.js, normalizer.js, response.js and the node_modules
- Upload the zip archive in lambda


### IF NECESSARY DELETE THIS

require('dotenv').config();

AWS.config.update({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    }
}); 

this is for test only