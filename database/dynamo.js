var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
  endpoint: "https://dynamodb.us-east-1.amazonaws.com/"
});

module.exports = new AWS.DynamoDB.DocumentClient();