const express = require('express');
const app = express();

const challenge20 = require('./app.js');

app.get('/', (req, res) => {
  const referenceid = req.query.referenceid;
  const command = req.query.command;
  if (command == undefined && referenceid != undefined) {
      res.send( challenge20.getInitialTrolley());
  } else {
      res.send( challenge20.moveTrolley(command, referenceid));
  }
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
