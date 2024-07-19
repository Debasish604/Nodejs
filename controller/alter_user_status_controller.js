const db = require('../database/database')

const { MAX } = require('mssql');
const { login } = require('./userController');

const alter_user_status_controller = {
    async alter_user_status(req, res, next) {
        await db.poolconnect


        try {

            const request = db.pool.request();

            let user_id = req.query.user_id;
            // console.log("user id is in alter user",user_id);
            // var access_id = req.body.access_id;
            // var action = req.body.action;


            if (user_id != null) {

                request.input('id', db.mssql.Int, user_id)
                    .output('response', db.mssql.VarChar(100))
                    .execute('[dbo].[alter_user_status]').then(function (recordsets, err, returnValue, affected) {
                        res.json(recordsets.output);
                        res.send(`
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Verification Response</title>
                            <style>
                                #response-message {
                                    padding: 10px;
                                    background-color: #4CAF50;
                                    color: white;
                                    border-radius: 5px;
                                    margin-top: 10px;
                                }
                            </style>
                        </head>
                        <body>
                        <div id="response-message">
                        <p>${recordsets.output.response}</p>
                            </div>
                        </body>
                        </html>
                    `);

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

module.exports = alter_user_status_controller