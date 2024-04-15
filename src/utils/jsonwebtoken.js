const jwt = require("jsonwebtoken");
const passport = require("passport")

const private_key = "palabrasecretaparatoken";

const generateToken = (user) => {
    const token = jwt.sign(user, private_key, {expiresIn: "24h"});
    return token;
}

const passportCall = (strategy) => {
    return (req, res, next) => {
        passport.authenticate(strategy, (error, user, info) => {
            if(error) {
                return next(error);
            }
            if(!user) {
                res.status(401).send({error: info.message ? info.message : info.toString()});
            }

            req.user = user; 
            next();
        })(req, res, next)
    }
}


const authorization = (role) => {
    return async (req, res, next) => {
        if(req.user.role !== role) {
            return res.status(403).send({message: "No tenes autorizacion"});
        }
        next();
    }
}

module.exports = {
    generateToken,
    passportCall,
    authorization
}