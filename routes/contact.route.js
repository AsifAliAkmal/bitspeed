module.exports = app => {
  const contacts = require("../controller/contact.controller");

  // Create a new Tutorial
  app.post("/", contacts.create);

//   // Retrieve all Tutorials
  app.post("/identify", contacts.findAll);

};