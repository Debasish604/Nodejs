const db=require('../database/database')

const { MAX } = require('mssql');
const { login } = require('./userController');

const user_access_list_controller = {
    async user_access_list(req, res, next) {
         await db.poolconnect

        // console.log(req.body);
        try {
            
            const request = db.pool.request(); 

            
            var userID = req.body.userID;
        
          
          
     if(userID!=null)
     {
        
        request.input('userID', db.mssql.NVarChar(500),userID)
       
        .execute('[dbo].[REMOTE_ACCESS__USER_ACCESS_LIST]').then(function(recordsets, err, returnValue, affected) {
            res.json(recordsets.recordset);
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

module.exports= user_access_list_controller