const db=require('../database/database')

const { MAX } = require('mssql');
const { login } = require('./userController');

const update_socket_user_controller = {
    async update_socket_user(req, res, next) {
         await db.poolconnect

       // console.log("req is socket update",req.body);
        try {
            
            const request = db.pool.request(); 

            
            var unique_id  = req.body.unique_id ;
            var socket_id = req.body.socket_id;
          
     if(unique_id!=null && socket_id!=null)
     {
        request.input('unique_id', db.mssql.Int,unique_id)
        .input('socket_id', db.mssql.NVarChar(250),socket_id)
        // .input('action', db.mssql.VarChar(100),action)
        .output('return', db.mssql.VarChar(100))
        .execute('[dbo].[update_socket_user]').then(function(recordsets, err, returnValue, affected) {
            res.json(recordsets.output);
        })
        .catch(function(err) {
                //console.log(err);
                return next(err)
              });
     }
     else{
        res.json("Body is Empty,Please send a body")
     }
    
        } catch (err) {
            //console.error('SQL error', err);
            return next(err)
        }
    }
}

module.exports= update_socket_user_controller