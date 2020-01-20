const express = require('express');
const app = express();

const challenge20 = require('./app.js');

app.get('/', (req, res) => {
  const referenceid = req.query.referenceid;
  const command = req.query.command;
  let repeat = req.query.repeat;
  if (repeat == undefined) { repeat = 1; }
  if (command == undefined || referenceid == undefined) {
      res.send( challenge20.getInitialTrolley());
  } else {
      res.send( challenge20.moveTrolley(command, referenceid, repeat));
  }
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
