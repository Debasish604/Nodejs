const db = require('../database/database')
const nodemailer = require('nodemailer');

const { MAX } = require('mssql');

const register_controller = {
    async register(req, res, next) {
        await db.poolconnect;

        // console.log(req.body);
        try {
            const request = db.pool.request();
            const { FIRST_NAME, LAST_NAME, USER_NAME, PASSWORD, Nickname } = req.body;

            if (FIRST_NAME && LAST_NAME && USER_NAME && PASSWORD && Nickname) {
                request
                    .input('FIRST_NAME', db.mssql.NVarChar(255), FIRST_NAME)
                    .input('LAST_NAME', db.mssql.NVarChar(255), LAST_NAME)
                    .input('USER_NAME', db.mssql.NVarChar(255), USER_NAME)
                    .input('PASSWORD', db.mssql.NVarChar(1000), PASSWORD)
                    .input('Nickname', db.mssql.NVarChar(1000), Nickname)
                    .output('RESPONSE', db.mssql.NVarChar(100))
                    .execute('[dbo].[REMOTE_ACCESS_REGISTER]')
                    .then(function (result) {
                        const responseMsg = result.output.RESPONSE;
                        
                        if (responseMsg === 'USERNAME_EXISTS') {
                            let data = [{ 'msg': "The username is already taken.", 'success': false }];
                            res.json(data);
                        } else if (responseMsg === 'NICKNAME_EXISTS') {
                            let data = [{ 'msg': "The nickname is already used.", 'success': false }];
                            res.json(data);
                        } else if (responseMsg === 'EXISTS') {
                            // This will handle cases where the response indicates general failure
                            let data = [{ 'msg': "Registration failed due to an unknown reason.", 'success': false }];
                            res.json(data);
                        } else {
                            // Successful registration case
                            send_email(USER_NAME, responseMsg, (callback) => {
                                // console.log("CallBack is:", callback);
                                if (callback === 'success') {
                                    let data = [{ 'msg': "User registered successfully.", 'success': true }];
                                    res.json(data);
                                } else {
                                    let data = [{ 'msg': "Failed to send confirmation email.", 'success': false }];
                                    res.json(data);
                                }
                            });
                        }
                    })
                    .catch(function (err) {
                        return next(err);
                    });
            } else {
                res.json([{ 'msg': "Request body is incomplete. Please provide all required fields.", 'success': false }]);
            }
        } catch (err) {
            return next(err);
        }
    }
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
            // console.log(error)
            cb('error');
        } else {
            cb('success');
        }
    });
}

module.exports = register_controller