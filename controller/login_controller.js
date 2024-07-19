const db=require('../database/database')

const { MAX } = require('mssql');
const { login } = require('./userController');

const login_controller = {
    async login(req, res, next) {
         await db.poolconnect

    
        try {
           
            const request = db.pool.request(); 

            
            var USER_NAME = req.body.USER_NAME;
            var PASSWORD = req.body.PASSWORD;
          
     if(USER_NAME!=null && PASSWORD!=null)
     {
        
        request.input('USER_NAME', db.mssql.NVarChar(255),USER_NAME)
        .input('PASSWORD', db.mssql.NVarChar(1000), PASSWORD)
        .output('RESPONSE', db.mssql.NVarChar(100))
        .execute('[dbo].[REMOTE_ACCESS_LOGIN]').then(function(recordsets, err, returnValue, affected) {
        res.json(Array({'user_details':recordsets.recordset,'status':recordsets.output.RESPONSE}))  
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

module.exports= login_controller