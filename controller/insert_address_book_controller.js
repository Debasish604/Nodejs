const db=require('../database/database')

const { MAX } = require('mssql');
const { login } = require('./userController');

const insert_address_book_controller = {
    async insert_address_book(req, res, next) {
         await db.poolconnect

        // console.log(req.body);
        try {
            
            const request = db.pool.request(); 

            
            var email = req.body.email;
            var userid = req.body.userid;
            // var action = req.body.action;
          
          
     if(userid!=null && email!=null)
     {
        
        request.input('email', db.mssql.NVarChar(200),email)
        .input('userid', db.mssql.Int,userid)
        .output('return', db.mssql.VarChar(100))
        .execute('[dbo].[insert_address_book]').then(function(recordsets, err, returnValue, affected) {
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

module.exports= insert_address_book_controller