const mysql = require('mysql');
const amqp = require('amqplib/callback_api');
let ch = null;

amqp.connect(process.env.RBMQ_URL,(err, conn)=>{
   conn.createChannel((err, channel)=>{
       ch = channel;
   })
});

/**
 * Method that retrieves all the measurements from a given sensor
 * @param req
 * @param res
 */
exports.getSensorMeasurements = (req, res) => {
    try {

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
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            console.log('The solution is: ', rows);
            res.status(200).send(rows);
        });

        connection.end()
    }catch (e) {
        console.log(e);
    }
};

/**
 * Method that retrieves all the measurements from a given sensor
 * @param req
 * @param res
 */
exports.getUserMeasurements = (req, res) => {

    try {

        let userId = req.params.userId;

        let connection = mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });

        connection.connect();

        connection.query('SELECT S.NAME AS SENSOR_NAME, M.VALUE_MEASURED, M.UNITS, M.MEASUREMENT_TIME, M.LATITUDE, M.LONGITUDE FROM ' +
            '(MEASUREMENTS M INNER JOIN SENSOR S ON S.ID=M.ID_SENSOR) WHERE M.ID_USER=? ORDER BY M.MEASUREMENT_TIME DESC LIMIT 10', [userId],
            function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                }
                console.log('User measurements : ', rows);
                res.status(200).send(rows);
            });

        connection.end()
    }catch (e) {
        console.log(e);
    }
};

/**
 * Method that retrieves all the measurements from a given sensor
 * @param req
 * @param res
 */
exports.getRecentMeasurements = (req, res) => {

    try {

        let connection = mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });

        connection.connect();

        connection.query('SELECT S.NAME, S.MIN_VALUE, S.MAX_VALUE, M.ID, M.VALUE_MEASURED, M.UNITS, M.MEASUREMENT_TIME, ' +
            'M.LATITUDE, M.LONGITUDE FROM (MEASUREMENTS M INNER JOIN SENSOR S ON S.ID=M.ID_SENSOR) ORDER BY M.MEASUREMENT_TIME DESC LIMIT 20',
            function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                }
                console.log('The solution is: ', rows);
                res.status(200).send(rows);
            });

        connection.end()
    }catch (e) {
        console.log(e);
    }
};

/**
 * Method that stores the information of a sensor's measurement
 * @param req
 * @param res
 */
exports.postMeasurement = (req, res) => {

    try {

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
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                }
                connection.query('UPDATE USERS SET SCORE = SCORE + 50 WHERE ID=?', [measurement.ID_USER],
                    (err, values, flds) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        }
                        res.status(200).send({
                            ID_USER: measurement.ID_USER,
                            SCORE: 50
                        });
                        connection.end()
                    });
            });
    }catch (e) {
        console.log(e);
    }
};

/**
 * Method that stores the information of an apparent color sensor's measurement
 * @param req
 * @param res
 */
exports.postApparentColorMeasurement = (req, res) => {

    try {
        let measurement = req.body;
        measurement.imagePath = req.file.path;
        ch.sendToQueue(process.env.QUEUE_NAME, new Buffer(JSON.stringify(measurement)));
        res.status(200).send({
            status: 'ok'
        });
    }catch (e) {
        console.log(e);
    }
};


process.on('exit', (code) => {
    ch.close();
    console.log(`Closing rabbitmq channel`);
});
