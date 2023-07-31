const { verify } = require("jsonwebtoken");
const AppError = require("../utils/appError");
const authConfig = require("../Configs/auth");

function ensureAuthentication(request, response, next) {
    const authHeader = request.headers.authorization;

    if(!authHeader) {
        throw new AppError("JWT Token não informado.", 401);
    }
    
    const [, token] = authHeader.split(" ");

    
    try {
        const { sub: user_id } = verify(token, authConfig.jwt.secret);
        
        request.user = {
            id: user_id,
        };
       
        return next();
    } catch(error) {
        throw new AppError("JWT Token inválido.", 401);
    }
}

module.exports = ensureAuthentication;
