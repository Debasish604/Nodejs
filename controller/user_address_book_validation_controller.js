const db=require('../database/database')
const looger = require('../logger');

const { MAX } = require('mssql');
const { login } = require('./userController');

const user_address_book_validation_controller = {
    async user_address_book_validation(req, res, next) {
         await db.poolconnect

       looger.info(req.body);
        try {
            
            const request = db.pool.request(); 

            
            var unique = req.body.unique;
            var userid = req.body.email;
        

          
     if(userid!=null && unique!=null)
     {
        
        request.input('unique', db.mssql.Int,unique)
        .input('emailId', db.mssql.VarChar(200),userid)
        .output('response',db.mssql.VarChar(100))
        .execute('[dbo].[user_address_book_validation]').then(function(recordsets, err, returnValue, affected) {
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

module.exports= user_address_book_validation_controller