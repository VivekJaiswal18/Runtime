import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import { rawListeners } from "process";
import { runInNewContext } from "vm";

export interface AuthReq extends Request {
    user: {id: number, username: string, email: string}
} 
export function authenticate(req: Request, res: Response, next: NextFunction){
// export function authenticate(req: AuthReq, res: Response, next: NextFunction){
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")){
        return res.status(401).json("No accessToken provided")
    }
    const token = authHeader.split(" ")[1];

    if (!token){
        return res.status(401).json("User not authenticated");
    }
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as AuthReq["user"]; //token exchange
    (req as AuthReq).user = decodedToken
    next();
}
catch(error){
    return res.status(401).json(`Token not successfully decoded ${error}`)
}
}

export function refreshToken(req: Request, res: Response, next: NextFunction){
    const token = req.cookies.refreshToken;
    
    if(!token){
        return res.status(401).json("RefeshToken not provided")
    }

    try{
        const decodedToken = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as AuthReq["user"];
        (req as AuthReq).user = decodedToken
        next()
    }
    catch(error){
       return res.status(401).json(`Refresh Token not successfully decoded ${error}`)
    }
}