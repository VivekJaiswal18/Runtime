import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";

export interface AuthReq extends Request {
    user: {username: string, email: string, password: string}
} 
export default function authenticate(req: AuthReq, res: Response, next: NextFunction){
    const token = req.headers.authorization?.split(" ")[1];
    if (!token){
        return res.status(500).json("User not authenticated");
    }
    try{
    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as AuthReq["user"];
    req.user = decodedToken
    next();
    }
    catch(error){
        return res.status(500).json(`Token not successfully decoded ${error}`)
    }
}

// we can use 2 approaches :
// 1. can get and decode the token in the headers or cookies and match it up with the db and pass that fetched (findbyId) user object to the route so it can access the user data.
// 2. can skip db lookup and simply decode the JWT and allow user to use route but it compromises on the stale data issue that if user updated any data like email then it wont be updated but only accesstoken refresh
