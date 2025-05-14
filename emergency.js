// const mongoose = require('mongoose');

// const emergencySchema = new mongoose.Schema({
//   name: String,
//   phone: String,
//   message: String,
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   }
// });

// module.exports = mongoose.model('Emergency', emergencySchema);

// const mongoose = require('mongoose');
// const emergencyConnection = mongoose.createConnection('mongodb://localhost:27017/medicareDB.emergencies', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// const emergencySchema = new mongoose.Schema({
//   name: String,
//   phone: String,
//   message: String,
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   }
// });

// module.exports = emergencyConnection.model('Emergency', emergencySchema);


// const mongoose = require('mongoose');
// const connections = require('./database');

// const emergencySchema = new mongoose.Schema({
//   name: String,
//   phone: String,
//   EmergencyType: String,
//   Address: String
// });

// module.exports = connections.emergencies.model('Emergency', emergencySchema);

// models/emergency.js
const mongoose = require('mongoose');
const connections = require('./database');

const emergencySchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  service: {
    type: String,
    required: true,
    enum: ['checkup', 'Home Emergency', 'Ambulance', 'First-Aid']
  },
  Address: {
    type: String,
    // Only required if service is 'Home Emergency' or 'Ambulance'
    required: function() {
      return this.service === 'Home Emergency' || this.service === 'Ambulance';
    }
  }
});
module.exports = connections.emergencies.model('Emergency', emergencySchema);

// module.exports = mongoose.model('Emergency', emergencySchema);