
const dotenv = require ('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

class JwtService{

static sign(payload,secret=JWT_SECRET)
{
    return jwt.sign(payload,secret,{expiresIn: '1h'})
}

static verify(token,secret=JWT_SECRET)
{
    return jwt.verify(token,secret)
}

}

module.exports = JwtService