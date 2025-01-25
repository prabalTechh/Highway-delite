import jwt, { JwtPayload } from "jsonwebtoken"
import { NextFunction, Request, Response } from "express";

export const middleware = (req:Request,res:Response,next:NextFunction) =>{

   const token = req.headers["authorization"] || "";
   

   const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

   if(decoded){

    //@ts-ignore
    req.userId = decoded.id;
    next();
   }else{
    res.status(402).json({
        message : "unauthorized!!"
    })
   }

    
}