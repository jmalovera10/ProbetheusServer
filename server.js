require('dotenv').config();
const express = require('express');
const SensorAPI = require("./api/SensorAPI");
const UserAPI = require('./api/UserAPI');
const path = require("path");
const bodyParser = require("body-parser");
const multer = require('multer');

const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "frontend/build")));
app.use(express.static(path.join(__dirname, '/contest_data')));

let upload = multer({dest: 'apparent_color/'});

app.get('/API/measurements/:sensorId', (req, res) => {
    SensorAPI.getSensorMeasurements(req, res);
});

app.get('/API/measurements/user/:userId', (req, res) => {
    SensorAPI.getUserMeasurements(req, res);
});

app.get('/API/measurements', (req, res) => {
    SensorAPI.getRecentMeasurements(req, res);
});

app.post('/API/measurement', (req, res) => {
    SensorAPI.postMeasurement(req, res);
});

app.post('/API/measurement/apparentColor', upload.single('photo'), (req, res) => {
    SensorAPI.postApparentColorMeasurement(req, res);
});

app.post('/API/user', (req, res) => {
    UserAPI.postUser(req, res);
});

app.get('/API/user/:userId', (req, res) => {
    UserAPI.getUser(req, res);
});

app.listen(process.env.PORT || 8081, () => {
    testId = 1;
    console.log(`Listening on :${process.env.PORT || 8081}`);
});
