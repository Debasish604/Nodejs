const db = require('../database/database')
const nodemailer = require('nodemailer');

const { MAX } = require('mssql');

const register_controller = {
    async register(req, res, next) {
        await db.poolconnect

        console.log(req.body);
        try {

            const request = db.pool.request();
            var FIRST_NAME = req.body.FIRST_NAME;
            var LAST_NAME = req.body.LAST_NAME;
            var USER_NAME = req.body.USER_NAME;
            var PASSWORD = req.body.PASSWORD;
            var SYSTEM_ID = req.body.SYSTEM_ID;
            if (FIRST_NAME != null && LAST_NAME != null && USER_NAME != null && PASSWORD != null && SYSTEM_ID != null) {

                request.input('FIRST_NAME', db.mssql.NVarChar(255), FIRST_NAME)
                    .input('LAST_NAME', db.mssql.NVarChar(255), LAST_NAME)
                    .input('USER_NAME', db.mssql.NVarChar(255), USER_NAME)
                    .input('PASSWORD', db.mssql.NVarChar(1000), PASSWORD)
                    .input('SYSTEM_ID', db.mssql.NVarChar(1000), SYSTEM_ID)
                    .output('RESPONSE', db.mssql.NVarChar(100))
                    .execute('[dbo].[REMOTE_ACCESS_REGISTER]').then(function (recordsets, err, returnValue, affected) {
                        if (recordsets.output.RESPONSE != 'EXISTS') {
                            // console.log("output is First",recordsets.input)
                            send_email(USER_NAME, recordsets.output.RESPONSE, (callback) => {
                                console.log("CallBack is:", callback)
                                if (callback == 'success') {
                                    let data = [{ 'msg': "User register successfully", 'success': true }]
                                    res.json(data);
                                }
                            })
                        }
                        else {
                            console.log(" same email dile log a dhuklo");
                            let data = [{ 'msg': recordsets.output, 'success': 'FAIELD' }]
                            res.json(data);
                            console.log('ai dekho data',data);
                        }

                    })
                    .catch(function (err) {
                        //console.log(err);
                        return next(err)
                    });
            }
            else {
                res.json("Body is Empty,Please send a body")
            }

        } catch (err) {
            //console.error('SQL error', err);
            return next(err)
        }
    },


}


async function send_email(email_id, user_id, cb) {
    // console.log("cb in send_email function",cb);
    // console.log("user_id",user_id);
    // console.log("user_id notation", user_id.RESPONSE);
    // console.log("email_id",email_id);
    let transporter = nodemailer.createTransport({
        host: "aivistatech.com",
        port: 465,
        secure: true, // true for 465, false for other po rts
        auth: {
            user: 'support@aivistatech.com',
            pass: 'Developer@123',
        },
    });
    // let send_html = '<a href="http://122.163.121.176:3008/api/user/alter_user_status?user_id=' + user_id + '" style="text-decoration: none;"><button style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Verify</button></a>';
    let send_html = '<a href="http://122.163.121.176:3008/api/user/alter_user_status?user_id=' + user_id + '" style=justify-content: center;"><button style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Verify</button></a>';

    let mailOptions = {
        from: 'support@aivistatech.com',
        to: email_id,
        subject: 'User verifing Email Remote access tool',
        text: 'Email verification',
        html: send_html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
            cb('error');
        } else {
            cb('success');
        }
    });
}

module.exports = register_controller