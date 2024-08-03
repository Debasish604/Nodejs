const db = require('../database/database');

const get_about_us_controller = {
    async get_about_us(req, res, next) {
        await db.poolconnect;

        try {
            const request = db.pool.request();
            
            request.execute('[dbo].[GetAboutUs]')
                .then(function(recordsets, err, returnValue, affected) {
                    if (err) {
                        console.log(err);
                        return next(err);
                    }
                    // console.log(recordsets);
                    res.json(recordsets.recordset);
                })
                .catch(function(err) {
                    console.log(err);
                    return next(err);
                });
        } catch (err) {
            console.error('SQL error', err);
            return next(err);
        }
    }
}

module.exports = get_about_us_controller;