// const mongoose = require('mongoose');

// const appointmentSchema = new mongoose.Schema({
//   firstName: String,
//   lastName: String,
//   phone: String,
//   date: String,
//   time: String,
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   }
// });

// module.exports = mongoose.model('Appointment', appointmentSchema);  // Fixed: using model() instead of views()


// const mongoose = require('mongoose');
// const appointmentConnection = mongoose.createConnection('mongodb://localhost:27017medicareDB.appointments', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// const appointmentSchema = new mongoose.Schema({
//   firstName: String,
//   lastName: String,
//   phone: String,
//   date: String,
//   time: String,
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   }
// });

// module.exports = appointmentConnection.model('Appointment', appointmentSchema);


const mongoose = require('mongoose');
const connections = require('./database');

const appointmentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phone: String,
  date: String,
  time: String,
  message: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = connections.appointments.model('Appointment', appointmentSchema);