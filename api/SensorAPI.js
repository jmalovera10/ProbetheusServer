const mysql = require('mysql');
//const AWS = require('aws-sdk');
//AWS.config.update({region: 'us-east-1'});

/**
 * Method that retrieves all the measurements from a given sensor
 * @param req
 * @param res
 */
exports.getSensorMeasurements = (req, res) => {
    let sensorId = req.params.sensorId;
    console.log(sensorId);

    let connection = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    connection.connect();

    connection.query('SELECT * FROM MEASUREMENTS WHERE ID_SENSOR=?', [sensorId], function (err, rows, fields) {
        if (err){
            console.log(err);
            res.status(500).send(err);
        }
        console.log('The solution is: ', rows);
        res.status(200).send(rows);
    });

    connection.end()
};

/**
 * Method that stores the information of a sensor's measurement
 * @param req
 * @param res
 */
exports.postMeasurement = (req, res) => {
    let measurement = req.body;
    let connection = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    connection.connect();

    connection.query('INSERT INTO MEASUREMENTS(ID_USER, ID_SENSOR, VALUE_MEASURED, UNITS, MEASUREMENT_TIME, LATITUDE, LONGITUDE) ' +
        'VALUES (?,?,?,?,?,?,?)',
        [measurement.ID_USER, measurement.ID_SENSOR, measurement.VALUE_MEASURED, measurement.UNITS, measurement.MEASUREMENT_TIME,
            measurement.LATITUDE, measurement.LONGITUDE],
        function (err, rows, fields) {
            if (err){
                console.log(err);
                res.status(500).send(err);
            }
            connection.query('UPDATE USERS SET SCORE = SCORE + 50 WHERE ID=?',[measurement.ID_USER],
                (err, values, flds)=>{
                    if(err){
                        console.log(err);
                        res.status(500).send(err);
                    }
                    res.status(200).send({
                        ID_USER: measurement.ID_USER,
                        SCORE: 50
                    });
                });
        });

    connection.end()
};
