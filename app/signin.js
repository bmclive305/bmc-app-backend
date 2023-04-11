'use strict';

const AWS = require('aws-sdk'); 
const table = 'app_users';
AWS.config.setPromisesDependency(require('bluebird'));
AWS.config.update({region: 'us-east-1'})
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.signin = async (event, context, callback) => {
    const parsedBody = JSON.parse(event.body);
    const username = parsedBody.username;
    const password = parsedBody.password;
    
  if (typeof username !== 'string' || typeof password !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t sign in because of validation errors.'));
    return;
  }
  let user;
  if (validateEmail(username)) {
    user = await retrieveUserByEmail(username);
    if (user.Items.length > 0) {
      if (!(bcrypt.compareSync(password, user.Items[0].password))) {
        context.status(404).header({
          'Access-Control-Allow-Origin': "*",
          'Access-Control-Allow-Headers': "x-access-token, Origin, Content-Type, Accept",
      }).send({
          message: "Invalid password!"
        });
      }
      user = user.Items[0];
    } else {
      context.status(401).header({
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Headers': "x-access-token, Origin, Content-Type, Accept",
    }).send({
        message: "Invalid email!"
      });
    }
  } else {
    user = await retrieveUserByUsername(username);
    if (user.Item) {
      if (!(bcrypt.compareSync(password, user.Item.password))) {
        context.status(401).header({
          'Access-Control-Allow-Origin': "*",
          'Access-Control-Allow-Headers': "x-access-token, Origin, Content-Type, Accept",
      }).send({
          accessToken: null,
          message: "Invalid password !"
        });
        return;
      }
      user = user.Item
    } else {
      context.status(404).header('Access-Control-Allow-Origin', "*").send({
        message: "User not found !"
      });
      return
    }
  }


  const token = jwt.sign({ id: user.id }, process.env.JWT_SIGNING_SECRET, {
    expiresIn: 86400 // 24 hours
  });

  try {
    dynamoDb.update({
      TableName: table,
      Key: {
          username
      },
      UpdateExpression: 'set #last_used = :last_used',
      ExpressionAttributeNames: {
          '#last_used': 'last_used',
      },
      ExpressionAttributeValues: {
          ':last_used': new Date().toLocaleString(),
      }
    })

  } catch(err) {
    console.log(err);
    console.error();
  }

  
  context.status(200).header({
    'Access-Control-Allow-Origin': "*",
    'Access-Control-Allow-Headers': "x-access-token, Origin, Content-Type, Accept",
}).send({
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.roles,
    accessToken: token
  });
    // .catch(err => {
    //   console.log(err);
    //   callback(null, {
    //     statusCode: 500,
    //     body: JSON.stringify({
    //       message: `Unable to submit user with email ${email}`
    //     })
    //   })
    // });
};

  const retrieveUserByUsername = async (username) => {
    
    const params = {
        TableName: table,
        Key: {
            username,
        }
    };
    const data = await dynamoDb.get(params).promise()
    //console.log(data)
    return data;

}

const retrieveUserByEmail = async (email) => {
    
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
  const data = await dynamoDb.query(params).promise()
  return data;

}

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// sUser({username: 'test', email: 'test', password: 'test'})

