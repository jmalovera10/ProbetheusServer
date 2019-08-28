const mysql = require('mysql');

/**
 * Method that adds user
 * @param req
 * @param res
 */
exports.postUser = (req, res) => {
    let user = req.body;
    let connection = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    connection.connect();

    connection.query('INSERT INTO USERS(ID, NAME, SEX) VALUES (?,?,?)', [user.ID, user.NAME, user.SEX],
        function (err, rows, fields) {
            if (err){
                console.log(err);
                res.status(500).send(err);
            }
            console.log('The solution is: ', rows);
            res.status(200).send(req.body);
        });

    connection.end()
};
