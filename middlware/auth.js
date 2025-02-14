import jwt from 'jsonwebtoken'

const userAuth = (req, res, next) => {
    const {token} = req.headers;
    console.log(token)

    if(!token) {
        return res
        .status(401)
        .json({success : false  , message : 'You are not authorized login againa !!'})
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        console.log("ToeknDecode" , tokenDecode)

        if(tokenDecode.id) {
            req.body.userId = tokenDecode.id;
        }
        else {
            return res.json({success : false , message : 'Not authorized . Login again'})
        }

        next();
    } catch (error) {
        return res.json({success : false , message : 'Not authorized . Login again !!'})
    }
}

export default userAuth;