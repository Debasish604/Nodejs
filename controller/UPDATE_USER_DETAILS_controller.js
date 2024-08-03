const db=require('../database/database')



const UPDATE_USER_DETAILS_controller = {
    async UPDATE_USER_DETAILS(req, res, next) {
         await db.poolconnect

        // console.log("req is",req.body);
        try {
            
            const request = db.pool.request(); 

            
            var USER_NAME  = req.body.USER_NAME ;
            var FIRST_NAME  = req.body.FIRST_NAME ;
            var LAST_NAME  = req.body.LAST_NAME ;
            var Nickname   = req.body.Nickname  ;
          
     if(USER_NAME!=null)
     {
        
        request.input('USER_NAME', db.mssql.NVarChar(255),USER_NAME)
        .input('FIRST_NAME', db.mssql.NVarChar(255),FIRST_NAME)
        .input('LAST_NAME', db.mssql.NVarChar(255),LAST_NAME)
        .input('Nickname', db.mssql.NVarChar(255),Nickname)
        .output('RESPONSE', db.mssql.VarChar(100))
        .execute('[dbo].[UPDATE_USER_DETAILS]').then(function(recordsets, err, returnValue, affected) {
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

module.exports= UPDATE_USER_DETAILS_controller