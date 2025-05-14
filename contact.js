// const mongoose = require('mongoose');

// const contactSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   subject: String,
//   message: String,
// });

// module.exports = mongoose.model('Contact', contactSchema);


// const mongoose = require('mongoose');
// const contactConnection = mongoose.createConnection('mongodb://localhost:27017/medicareDB.contacts', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// const contactSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   subject: String,
//   message: String
// });

// module.exports = contactConnection.model('Contact', contactSchema);


const mongoose = require('mongoose');
const connections = require('./database');

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = connections.contacts.model('Contact', contactSchema);