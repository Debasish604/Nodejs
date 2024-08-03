const express = require('express');
var jwt = require('jsonwebtoken');
const cors=require('cors');
const app =express();
app.use(express.json())
app.use(cors());
const user = require('./routes/route');
app.get('/', (req, res) => {
    res.send('<h1>Remote server running</h1>');
  });
app.use('/api/user',user);
module.exports=app;