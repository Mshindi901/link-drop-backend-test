export const authorization = (...allowedRoles) => {
    return(req, res, next) => {
        if(!req.user){
            return res.status(401).json({
                success: false,
                message: 'unauthorized user'
            });
        };
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        };
        next();
    }
} 