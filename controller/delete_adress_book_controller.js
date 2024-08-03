const db=require('../database/database')

const { MAX } = require('mssql');
const { login } = require('./userController');

const delete_adress_book_controller = {
    async delete_address_book(req, res, next) {
         await db.poolconnect

        // console.log("test"+req.body);
        try {
            
            const request = db.pool.request(); 

            
            var user_id = req.body.user_id;
            var email_id = req.body.email_id;
            // var action = req.body.action;
          
          
     if(user_id!=null)
     {
        
        request.input('user_id', db.mssql.NVarChar(100),user_id)
         .input('email_id', db.mssql.NVarChar(100),email_id)
        // .input('action', db.mssql.VarChar(100),action)
        .output('response',db.mssql.VarChar(100))
        .execute('[dbo].[delete_address_book]').then(function(recordsets, err, returnValue, affected) {
            // console.log(recordsets);
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

module.exports= delete_adress_book_controller