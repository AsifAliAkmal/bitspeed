const express = require('express');
const dotenv = require('dotenv');
const db = require('./models/db')

dotenv.config();


const app = express();


// parse requests of content-type - application/json
app.use(express.json());




db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });


  require("./routes/contact.route")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});