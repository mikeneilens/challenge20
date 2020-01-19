const express = require('express');
const app = express();

const challenge20 = require('./app.js');

app.get('/', (req, res) => {
  const referenceid = req.query.referenceid;
  const command = req.query.command;
  if (command == undefined) {
      res.send( challenge20.getInitialTrolley() + ' command=' + command);
  } else {
      console.log(`command = ${command} referenceid = ${referenceid}`);
      res.send( challenge20.moveTrolley(command, referenceid));
  }
  //res.send('Hello ' + name + ' from App Engine!');
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
