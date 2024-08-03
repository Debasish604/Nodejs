const db = require('../database/database')

const { MAX } = require('mssql');
const { login } = require('./userController');
const JwtService = require('../service/jwtService');

const login_controller = {
    async login(req, res, next) {
        await db.poolconnect


        try {

            const request = db.pool.request();


            var USER_NAME = req.body.USER_NAME;
            var PASSWORD = req.body.PASSWORD;

            if (USER_NAME != null && PASSWORD != null) {

                request.input('USER_NAME', db.mssql.NVarChar(255), USER_NAME)
                    .input('PASSWORD', db.mssql.NVarChar(1000), PASSWORD)
                    .output('RESPONSE', db.mssql.NVarChar(100))
                    .execute('[dbo].[REMOTE_ACCESS_LOGIN]').then(function (recordsets, err, returnValue, affected) {


                        res.json(Array({
                        'user_details': recordsets.recordset, 
                         'status': recordsets.output.RESPONSE,
                         'accessToken': JwtService.sign({ username: req.body.USER_NAME,name:recordsets.recordset[0].FRIST_NAME+' '+recordsets.recordset[0].UNIQUE_ID}) }))
                    })
                    .catch(function (err) {
                        console.log(err);
                        return next(err)
                    });
            }
            else {
                res.json("Body is Empty,Please send a body")
            }

        } catch (err) {
            console.error('SQL error', err);
            return next(err)
        }
    }
}

module.exports = login_controller



/*

const db=require('../database/database')

// const { MAX } = require('mssql');
const { login } = require('./userController');



const login_controller = {
    async login(req, res, next) {
        try {
            const USER_NAME = req.body.USER_NAME;
            const PASSWORD = req.body.PASSWORD;

            // Use parameterized queries to prevent SQL injection
            const sql = `
                CALL REMOTE_ACCESS_LOGIN(?, ?, @OUTPUT);
                SELECT @OUTPUT AS response;
            `;

            db.pool.query(sql, [USER_NAME, PASSWORD], (error, results) => {
                if (error) {
                    console.error('Database query error:', error);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                // Extract the response from the results
                const response = results[1][0].response; // results[1] is the result of the SELECT @OUTPUT AS response query
                res.json({ response });
            });
        } catch (err) {
            console.error('Error in login controller:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = login_controller;

*/