const db = require('../database/database');
const nodemailer = require('nodemailer');
const { MAX } = require('mssql');

async function storeOtp(email, otp) {
    // const currentTime = new Date();
    // const expirationTime = new Date(currentTime.getTime() + 10 * 60 * 1000);

    await db.poolconnect;

    const request = db.pool.request();
    await request
        .input('UserName', db.mssql.NVarChar(255), email)
        .input('OTP', db.mssql.NVarChar(10), otp)
        // .input('ExpirationDateTime', db.mssql.DateTime, expirationTime)
        .query(`
            INSERT INTO [dbo].[UserOTP] (UserName, OTP, ExpirationDateTime, IsVerified, CreatedAt)
            VALUES (@UserName, @OTP, DATEADD(MINUTE, 10, CURRENT_TIMESTAMP), 0, GETDATE())
        `);
}

async function verifyStoredOtp(useremail, otp) {
    await db.poolconnect;

    const request = db.pool.request();
    try {
        // First request: Check OTP
        const result = await request
            .input('UserName', db.mssql.NVarChar(255), useremail)
            .input('OTP', db.mssql.NVarChar(10), otp)
            .query(`
                SELECT * FROM [dbo].[UserOTP]
                WHERE UserName = @UserName AND OTP = @OTP AND ExpirationDateTime > GETDATE() AND IsVerified = 0
            `);

        // console.log('verify otp');

        if (result.recordset.length > 0) {
            // Mark the OTP as verified with a new request
            const updateRequest = db.pool.request();
            await updateRequest
                .input('UserName', db.mssql.NVarChar(255), useremail)
                .input('OTP', db.mssql.NVarChar(10), otp)
                .query(`
                    UPDATE [dbo].[UserOTP]
                    SET IsVerified = 1
                    WHERE UserName = @UserName AND OTP = @OTP
                `);

            return true; // OTP is valid and verified
        } else {
            return false; // OTP is invalid or expired
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        throw error;
    }
}


async function send_email(email_id, otp) {
    let transporter = nodemailer.createTransport({
        host: "aivistatech.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'support@aivistatech.com', // your email
            pass: 'Developer@123', // your email password
        },
    });

    let mailOptions = {
        from: 'support@aivistatech.com',
        to: email_id,
        subject: 'Your OTP Code',
        text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return 'success';
    } catch (error) {
        console.log(error);
        return 'error';
    }
}

const forgot_password_controller = {
    async sendOtp(req, res, next) {
        const { email } = req.body;
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        try {
            await storeOtp(email, otp);

            const emailStatus = await send_email(email, otp);
            if (emailStatus === 'success') {
                res.json({ success: true, msg: 'OTP sent successfully.' });
            } else {
                res.json({ success: false, msg: 'Failed to send OTP. Please try again.' });
            }
        } catch (error) {
            console.error('Error storing OTP or sending email:', error);
            res.json({ success: false, msg: 'Failed to send OTP. Please try again.' });
        }
    },

    async verifyOtp(req, res, next) {
        const { useremail, otp } = req.body;

        try {
            const isValidOtp = await verifyStoredOtp(useremail, otp);

            if (isValidOtp) {
                res.json({ success: true, msg: 'OTP verified successfully.' });
            } else {
                res.json({ success: false, msg: 'Invalid or expired OTP. Please try again.' });
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            res.json({ success: false, msg: 'An error occurred while verifying the OTP. Please try again.' });
        }
    },

    async resetPassword(req, res, next) {
        const { email, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.json({ success: false, msg: 'Passwords do not match.' });
        }

        const request = db.pool.request();
        try {
            const result = await request
                .input('USER_NAME', db.mssql.NVarChar(255), email)
                .input('NEW_PASSWORD', db.mssql.NVarChar(100), newPassword)
                .input('CONFIRM_PASSWORD', db.mssql.NVarChar(100), confirmPassword)
                .output('RESPONSE', db.mssql.VarChar(100))
                .execute('[dbo].[FORGOT_PASSWORD]');

            const responseMsg = result.output.RESPONSE;
            if (responseMsg === 'Password reset successfully.') {
                res.json({ success: true, msg: responseMsg });
            } else {
                res.json({ success: false, msg: responseMsg });
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            res.json({ success: false, msg: 'An error occurred while resetting the password. Please try again.' });
        }
    }
};

module.exports = forgot_password_controller;