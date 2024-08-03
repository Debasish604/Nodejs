const db=require('../database/database')

const { MAX } = require('mssql');
const { login } = require('./userController');

const validation_controller = {
    async validation(req, res, next) {
         await db.poolconnect

        // console.log("validation controller req body",req.body);
        try {
            
            const request = db.pool.request(); 

            
            var unique = req.body.unique;
            var acess_id = req.body.acess_id;
           
          
    
     if(unique!=null && acess_id!=null)
     {
        
        request.input('unique', db.mssql.Int,unique)
        .input('acess_id', db.mssql.Int,acess_id)
        .output('response', db.mssql.VarChar(100))
        .execute('[dbo].[REMOTE_ACCESS_VALIDATION]').then(function(recordsets, err, returnValue, affected) {
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

module.exports= validation_controller