const db=require('../database/database')

const { MAX } = require('mssql');
const { login } = require('./userController');

const get_my_details_controller = {
    async get_my_details(req, res, next) {
         await db.poolconnect

        // console.log(req.body);
        try {
            
            const request = db.pool.request(); 

            
            var user_id = req.body.user_id;
            // var access_id = req.body.access_id;
            // var action = req.body.action;
          
          
     if(user_id!=null)
     {
        
        request.input('user_id', db.mssql.Int,user_id)
        // .input('action', db.mssql.VarChar(100),action)
        // .output('get',db.mssql.VarChar(20))
        .execute('[dbo].[get_my_details]').then(function(recordsets, err, returnValue, affected) {
            // console.log(recordsets);
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

module.exports= get_my_details_controller