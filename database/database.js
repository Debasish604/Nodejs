const {DB_HOST_NAME,DB_USER_NAME,DB_PASSWORD,DB_NAME} =process.env;

const mssql = require('mssql');

const config={
    user: DB_USER_NAME,
    password: DB_PASSWORD,
    server: DB_HOST_NAME, 
    database: DB_NAME,
    port:1433,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: true, 
      trustServerCertificate: true 
    }
}
const pool = new mssql.ConnectionPool(config);
const close = pool.close()
const poolconnect = pool.connect()  
.then(pool1 => {  
console.log('Connected to MSSQL')  
return pool1 
})  
.catch(err => console.log('Database Connection Failed! Bad Config: ', err))
module.exports = {
    poolconnect,pool,mssql,close
}  

