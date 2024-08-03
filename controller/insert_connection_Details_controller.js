const db=require('../database/database')

const { MAX } = require('mssql');
const { login } = require('./userController');

const insert_connection_Details_controller = {
    async insert_connection_Details(req, res, next) {
         await db.poolconnect

        // console.log(req.body);
        try {
            
            const request = db.pool.request(); 

            
            var user_id = req.body.user_id;
            var user_email_id = req.body.user_email_id;
            var user_unique_id = req.body.user_unique_id;
            var user_device_details = req.body.user_device_details;
            var client_id = req.body.client_id;
            var client_email_id = req.body.client_email_id;
            var client_unique_id = req.body.client_unique_id;
            var client_device_details=req.body.client_device_details
            var application_version= req.body.application_version

            // console.log(req.body)
           

          
          
     if(user_id!=null && user_email_id!= null && user_unique_id!= null && user_device_details!=null)
     {
        request.input('user_id', db.mssql.Int,user_id)
        .input('user_email_id', db.mssql.NVarChar(100),user_email_id)
        .input('user_unique_id', db.mssql.Int,user_unique_id)
        .input('user_device_details', db.mssql.NVarChar(2000),user_device_details)
        .input('client_id', db.mssql.Int,client_id)
        .input('client_email_id', db.mssql.NVarChar(100),client_email_id)
        .input('client_unique_id', db.mssql.Int,client_unique_id)
        .input('client_device_details', db.mssql.NVarChar(2000),client_device_details)
        .input('application_version', db.mssql.NVarChar(200),application_version)
        .output('response',db.mssql.VarChar(100))
        .execute('[dbo].[insert_connection_Details]').then(function(recordsets, err, returnValue, affected) {
            //console.log(recordsets);
            res.json(recordsets.output);
        })
        .catch(function(err) {
               // console.log(err);
                return next(err)
              });
     }
     else{
        res.json("Body is Empty,Please send a bodyyy")
     }
    
        } catch (err) {
            console.error('SQL error', err);
            return next(err)
        }
    }
}

module.exports= insert_connection_Details_controller