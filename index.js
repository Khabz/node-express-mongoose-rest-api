const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.PORT || "mongodb://localhost:27017/dash";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
// Bring in passport strategy 
require('./api/middlewares/passport')(passport);

mongoose
    .connect(MONGO_URI, {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => {
        console.log(`${MONGO_URI} was successfully connected`);
    });

app.get("/", (req, res) => {
    res.send(`Server listening to PORT ${PORT}`);
});

const userRoute = require("./api/routes/users");

app.use('/api/users', userRoute);

app.listen(PORT, () => {
    console.log(`Server listening to port ${PORT}`);
});