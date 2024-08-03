const JwtService = require('../service/jwtService');
const CustomeErrorHandler=require('../service/CustomrErrorHandler');

const JwtVerify=async (req,res,next)=>{

    let authHeader=req.headers.authorization

    if(!authHeader)
    {
        return next(CustomeErrorHandler.customThrowHandler(401,{'status':0,'message':'Missing token in Header'}));
    }
    else{
        const token =authHeader.split(' ')[1];
        try {
            const Value=JwtService.verify(token);
            req.user={};
            req.user.username=Value.username;
            req.user.name=Value.name;
            next()
        } 
        catch(err)
        {
            if (err.message=='jwt expired' )
            {
                return next(CustomeErrorHandler.customThrowHandler(401,{'status':401,'message':'Jwt Token Expired'}));
            }
            else{
                return next(CustomeErrorHandler.customThrowHandler(401,{'status':0,'message':err.message}));
            }
        }
    }
    
}

module.exports=JwtVerify;