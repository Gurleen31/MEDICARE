const mongoose = require('mongoose');

// Database Configuration
const databases = {
//   patients: 'mongodb://localhost:27017/medicareDB_patients',
  emergencies: 'mongodb://localhost:27017/medicareDB_emergencies',
  contacts: 'mongodb://localhost:27017/medicareDB_contacts',
  appointments: 'mongodb://localhost:27017/medicareDB_appointments'
};

// Create and export connections
const connections = {};
Object.keys(databases).forEach(dbName => {
  connections[dbName] = mongoose.createConnection(databases[dbName], {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  connections[dbName].on('connected', () => {
    console.log(`Connected to ${dbName} database successfully`);
  });
  connections[dbName].on('error', (err) => {
    console.error(`MongoDB connection error for ${dbName}:`, err);
  });

  connections[dbName].on('disconnected', () => {
    console.log(`Disconnected from ${dbName} database`);
  });
});

module.exports = connections;