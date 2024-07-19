const { createLogger, transports, format } = require('winston')
 const customeFormat = format.combine(format.timestamp(),format.printf((info)=>{
    return `${info.timestamp} [${info.level.toUpperCase().padEnd(7)}] - ${JSON.stringify(info.message)}`
}))
const logger = createLogger({
    format:customeFormat,
    level:'debug',
    transports:[
        new transports.Console(),
        new transports.File({filename:'app.log',level:"info"})
    ]
});
module.exports = logger;