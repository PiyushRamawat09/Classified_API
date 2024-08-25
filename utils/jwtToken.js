const jwt = require('jsonwebtoken');
const getJWTtoken = (user_id) =>{
    return jwt.sign({id : user_id}, process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRE
    })
}
const sendToken = (userData,user_id, StatusCode, res) => {
    const token = getJWTtoken(user_id);

    //options for cookie
    
    const options = {
        expires : new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000    //milliseconds
        ),
        httpOnly : true,
    }

    res.status(StatusCode).cookie("token", token, options).json({
        success : true,
        userData,
        token
    })

}

module.exports =  sendToken;