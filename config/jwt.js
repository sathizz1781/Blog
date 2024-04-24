const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('auth-token');
  if(!token){
    return res.json({statusCode:401,status:false,message:"Access denied. No token provided",result:{},error:{}});
  }else{
    try{
        const decodedToken = jwt.verify(token, 'sk@33');
        req.user = decodedToken;
        req.body.doneBy = decodedToken._id
        next()
        
      }catch(error){
        res.json({statusCode:401,status:false,message:"Invalid token",result:{},error:{}});
      }
  }
};
module.exports = verifyToken;
