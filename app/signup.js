'use strict';

const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({ length: 12 });
const AWS = require('aws-sdk'); 
const saltRounds = 10;
const table = 'app_users';
AWS.config.setPromisesDependency(require('bluebird'));
AWS.config.update({region: 'us-east-1'})

const dynamoDb = new AWS.DynamoDB.DocumentClient();

function retrieveUserByUsername(username) {
  return dynamoDb.get({
    TableName: table,
    Key: {
      username: username
    }
  }).promise();
}

module.exports.signup = async (event, context, callback) => {
    const parsedBody = JSON.parse(event.body);
    const username = parsedBody.username;
    const email = parsedBody.email;
    const password = parsedBody.password;

  if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t sign up because of validation errors.'));
    return;
  }

  if (!validateEmail(email)) {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t sign up because of email validation errors.'));
    return;
  }

  try {
    await retrieveUserByUsername(username).then( (userName) => {
      if (userName.Item && Object.keys(userName.Item).length !== 0) {
        context.status(400).header({
          'Access-Control-Allow-Origin': "*",
          'Access-Control-Allow-Headers': "x-access-token, Origin, Content-Type, Accept",
      }).send({
                message: "Failed! Username is already in use!"
              });
        return;
      }
    })
  } catch (err) {
    callback(err)
  }

  

  await retrieveUserByEmail(email).then( (userEmail) => {
    if (userEmail.Items.length > 0) {
      context.status(400).header({
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Headers': "x-access-token, Origin, Content-Type, Accept",
    }).send({
        message: "Failed! Email is already in use!"
      });
    }

  })

    const user = {
    username,
    email,
    password
  }

await registerUser(user).then( () => {
    context.status(200).header({
      'Access-Control-Allow-Origin': "*",
      'Access-Control-Allow-Headers': "x-access-token, Origin, Content-Type, Accept",
  }).send({ message: "User registered successfully!"});
}
)

  

  
};



const registerUser = user => {
    console.log('Registering user');
    const timestamp = new Date().toLocaleString();
    const userInfo = {
      TableName: table,
      Item: {
        id: "BID" + uid(),
        username: user.username,
        email: user.email,
        password: require('bcryptjs').hashSync(user.password, saltRounds),       
        roles: ["ROLE_USER"],
        date_created: timestamp,
        last_updated: timestamp,
        last_used: timestamp,
    },
    };
    return dynamoDb.put(userInfo).promise()
  };


const retrieveUserByEmail = (email) => {
    
  const params = {
      TableName: table,
      IndexName: 'email-index',
      Limit: 1,      
      KeyConditionExpression: "#email = :email",
      ExpressionAttributeNames:{
          "#email": "email"
      },
      ExpressionAttributeValues: {
          ":email":email
      }
  };
  return dynamoDb.query(params).promise()
}

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// registerUser({username: 'test', email: 'test', password: 'test'})