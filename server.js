require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const path = require("path");
const expressLayout = require("express-ejs-layouts");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo");
const passport = require('passport');
const Emitter = require('events');
const PORT = process.env.PORT || 3000;

// Database connection
mongoose.connect(
  "mongodb+srv://tathagata1805:Tatha2020@cluster0.q0z3h.mongodb.net/pizzas?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const connection = mongoose.connection;
try {
  connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
  });
} catch (e) {
  console.log(e);
}

function close_connection() {
  connection.close();
}

// session store
let mongoStore = MongoDbStore.create({
    mongoUrl: "mongodb+srv://tathagata1805:Tatha2020@cluster0.q0z3h.mongodb.net/pizzas?retryWrites=true&w=majority",
    dbName: 'pizzas',
    mongooseConnection: connection,
    collectionName: 'sessions'
})

// Event Emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

// Sessionn configuration
app.use(session({
    secret: process.env.COOKIE_SECRET,
    store: MongoDbStore.create({
        mongoUrl: "mongodb+srv://tathagata1805:Tatha2020@cluster0.q0z3h.mongodb.net/pizzas?retryWrites=true&w=majority",
        collectionName: 'sessions',
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
        resave: false,
    })
}))

app.use(flash());

// Passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())
app.use(session({ secret: 'thisismysecret' }));

// Assets
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})


// Set Template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

// Calling the routes from web.js file as a function
require("./routes/web")(app);

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Socket configuration

const io = require('socket.io')(server)
io.on('connection', (socket) => {
      // Join
      console.log(socket.id)
      socket.on('join', (orderId) => {
        socket.join(orderId)
      })
})

// Emitter configuration
eventEmitter.on('orderUpdated', (data) => {
  io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
  io.to('adminRoom').emit('orderPlaced', data)
})