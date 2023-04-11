exports.allAccess = (req, res) => {
  res.status(200);
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token");
  res.send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).header({
    'Access-Control-Allow-Origin': "*",
    'Access-Control-Allow-Headers': "x-access-token, Origin, Content-Type, Accept",
}).send("Users Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).header({
    'Access-Control-Allow-Origin': "*",
    'Access-Control-Allow-Headers': "x-access-token, Origin, Content-Type, Accept",
}).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).header({
    'Access-Control-Allow-Origin': "*",
    'Access-Control-Allow-Headers': "x-access-token, Origin, Content-Type, Accept",
}).send("Moderator Content.");
};
