const db=require('../database/database')

const { MAX } = require('mssql');
const { login } = require('./userController');

const add_remove_action_controller = {
    async add_remove_action(req, res, next) {
         await db.poolconnect

        // console.log(req.body);
        try {
            
            const request = db.pool.request(); 

            
            var user_id = req.body.user_id;
            var access_id = req.body.access_id;
            var action = req.body.action;
          
          
     if(user_id!=null && access_id!=null && action!=null)
     {
        
        request.input('user_id', db.mssql.Int,user_id)
        .input('access_id', db.mssql.Int,access_id)
        .input('action', db.mssql.VarChar(100),action)
        .output('response', db.mssql.VarChar(100))
        .execute('[dbo].[REMOTE_ACCESS_ADD_REMOVE_ACTION]').then(function(recordsets, err, returnValue, affected) {
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

module.exports= add_remove_action_controller