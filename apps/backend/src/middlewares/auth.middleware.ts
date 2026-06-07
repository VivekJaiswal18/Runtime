import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";

export interface AuthReq extends Request {
    user: {id: number, username: string, email: string}
} 
export function authenticate(req: AuthReq, res: Response, next: NextFunction){
    // const token = req.headers.authorization?.split(" ")[1];
    const token = req.cookies.refreshToken;
    if (!token){
        return res.status(500).json("User not authenticated");
    }
    try{
    const decodedToken = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as AuthReq["user"]; //token exchange
    req.user = decodedToken
    next();
    }
    catch(error){
        return res.status(500).json(`Token not successfully decoded ${error}`)
    }
}

