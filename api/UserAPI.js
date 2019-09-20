const mysql = require('mysql');
const sha256 = require('sha256');

/**
 * Method that adds user
 * @param req
 * @param res
 */
exports.postUser = (req, res) => {
    try {
        let user = req.body;
        let connection = mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });

        connection.connect();

        const ID = sha256(`${Date.now()}`);

        connection.query('INSERT INTO USERS(ID, NAME, SEX, SCORE) VALUES (?,?,?,?)', [ID, user.NAME, user.SEX, user.SCORE],
            function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                }
                console.log('USER CREATED, ID: ', ID);
                res.status(200).send({ID});
            });

        connection.end()
    }catch (e) {
        console.log(e);
    }
};
