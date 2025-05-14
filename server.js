const express = require('express'); // Express for routing and middleware management
const path = require('path'); // Path to handle file paths
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Single file approach
// const { Appointment, Emergency, Contact } = require('./models/database');

// Multiple files approach
const Appointment = require('./models/appointment');
const Emergency = require('./models/emergency');
const Contact = require('./models/contact');

const app = express();
const PORT = 3030;
const fs = require('fs');

// Import middlewares
const logger = require('./middlewares/logger'); // Import logger middleware
const errorHandler = require('./middlewares/errorHandler'); // Import error handler middleware
const cors = require('./middlewares/cors');
const helmet = require('./middlewares/helmet');
const cookieParser = require('./middlewares/cookieParser');
const morgan = require('./middlewares/morgan');
const limiter = require('./middlewares/rate'); // Import rate limit middleware

app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use logger middleware for all incoming requests
app.use(logger); // Log each request
app.use(morgan('tiny'));
app.use(cookieParser);
app.use(helmet());
app.use(cors());
app.use(limiter);

// MongoDB Connection
// mongoose.connect('mongodb://localhost:27017/medicareDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => console.log('MongoDB Connected'))
//   .catch(err => console.log(err));


// Set EJS as view engine
app.set('view engine', 'ejs'); // Use EJS as templating engine
app.set('views', path.join(__dirname, 'views')); // Set the views directory for EJS templates

// Serve static files (CSS, JS) from the /public directory
app.use(express.static(path.join(__dirname, 'views'))); // Serve static files from the views directory

// Import API routes from apiRoutes.js
const apiRoutes = require('./api/apiRoutes'); // Import the API routes for login and register functionality
app.use('/api', apiRoutes); // Mount the API routes on /api path

// Serve login page (unchanged)
app.get('/api/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Serve index.ejs at the root URL (changed from sending HTML to EJS)
app.get('/', (req, res) => {
  res.render('index', { 
    pageTitle: 'Healthcare Website',
    // services: [
    //   { title: "Cardiology", description: "Heart care and support." },
    //   { title: "Pediatrics", description: "Child healthcare services." },
    //   { title: "Orthopedics", description: "Bone and joint treatments." },
    // ],
  });
});

// Serve other pages (unchanged)
app.get('/api/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});
// Serve login page (changed to render login.ejs)
app.get('/login', (req, res) => {
  res.render('login', { 
    title: 'Hospital Management Login',
    brandName: 'Medicare',
    welcomeMessage: 'Welcome Back!',
    loginEndpoint: '/appointment',
    loginButtonText: 'Login',
    signupUrl: '/signup',
    homeUrl: '/appointment',
    backgroundImage: '/bg_login2.png'
  });
});
app.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact Us',
      pageTitle: 'Get in Touch with Us',
      pageSubtitle: 'We are here to assist you with any inquiries.',
      mapImageUrl: '/images/contact.jpg',
      user: req.user
  });
});

app.get('/signup', (req, res) => {
  res.render('signup', { title: 'Medicare - Sign Up', success: false, error: null });

});

app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  // Very basic validation
  if (!username || !password) {
      return res.render('signup', {
          title: 'Medicare - Sign Up',
          success: false,
          error: 'All fields are required!',
      });
  }

  const filePath = path.join(__dirname, 'models', 'users.json');
  const users = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Check if user already exists
  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.render('signup', {
      title: 'Medicare - Sign Up',
      success: false,
      error: 'Username already exists!',
    });
  }

  // Add new user
  users.push({ username, password });
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
  return res.render('login', {
    title: 'Hospital Management Login',
    brandName: 'Medicare',
    welcomeMessage: 'Signup successful! Please log in.',
    loginEndpoint: '/',
    loginButtonText: 'Login',
    signupUrl: '/signup',
    homeUrl: '/',
    backgroundImage: '/bg_login2.png'
  });
});
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});
app.get("/appointment", (req, res) => {
  res.render("appointment", {
      title: "Medicare - Appointment",
      user: req.user 
  });
});
app.get('/emergency', (req, res) => {
    res.render('emergency', { title: 'Emergency Services',
      user: req.user  });
});

app.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'blog.html'));
});

app.get('/department', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'department.html'));
});
app.get('/doctor', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'doctor.html'));
});
app.get('/review', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'review.html'));
});

app.post('/appointment', async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    res.send('Appointment booked successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to book appointment');
  }
});

app.post('/emergency', async (req, res) => {
  try {
    const newemergency = new Emergency(req.body);
    await newemergency.save();
    res.send('Emergency request booked!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving emergency data.');
  }
});
app.post('/contact', async (req, res) => {
  try {
    const newcontact = new Contact(req.body);
    await newcontact.save();
    res.send('Contact request booked!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving contact data.');
  }
});



// Use error handler middleware for catching and handling errors
app.use(errorHandler); // Handle errors globally

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
