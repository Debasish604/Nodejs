const db=require('../database/database')

const { MAX } = require('mssql');
const { login } = require('./userController');

const logout_controller = {
    async logout(req, res, next) {
     await db.poolconnect
        try {
        const request = db.pool.request();   
        var USER_NAME = req.body.USER_NAME; 
     if(USER_NAME!=null)
     {
        request.input('USER_NAME', db.mssql.NVarChar(255),USER_NAME)
        .output('RESPONSE', db.mssql.NVarChar(100))
        .execute('[dbo].[REMOTE_ACCESS_LOGOUT]').then(function(recordsets, err, returnValue, affected) {
            res.json(recordsets.output);
        })
        .catch(function(err) {
                console.log(err);
                return next(err)
              });
     }
     else{
        res.json("Body is Empty,Please send a body")
     }
    
        } catch (err) {
            console.error('SQL error', err);
            return next(err)
        }
    }
}

module.exports= logout_controller