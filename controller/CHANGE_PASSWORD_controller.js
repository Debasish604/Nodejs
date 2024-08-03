const db=require('../database/database')



const CHANGE_PASSWORD_controller = {
    async CHANGE_PASSWORD(req, res, next) {
         await db.poolconnect

        // console.log("req is",req.body);
        try {
            
            const request = db.pool.request(); 

            
            var USER_NAME  = req.body.USER_NAME ;
            var OLD_PASSWORD   = req.body.OLD_PASSWORD  ;
            var NEW_PASSWORD  = req.body.NEW_PASSWORD ;
            var CONFIRM_PASSWORD   = req.body.CONFIRM_PASSWORD  ;
          
     if(USER_NAME!=null && OLD_PASSWORD!=null && NEW_PASSWORD!=null && CONFIRM_PASSWORD!=null)
     {
        
        request.input('USER_NAME', db.mssql.NVarChar(255),USER_NAME)
        .input('OLD_PASSWORD', db.mssql.NVarChar(100),OLD_PASSWORD)
        .input('NEW_PASSWORD', db.mssql.NVarChar(100),NEW_PASSWORD)
        .input('CONFIRM_PASSWORD', db.mssql.NVarChar(100),CONFIRM_PASSWORD)
        .output('RESPONSE', db.mssql.VarChar(100))
        .execute('[dbo].[CHANGE_PASSWORD]').then(function(recordsets, err, returnValue, affected) {
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

module.exports= CHANGE_PASSWORD_controller