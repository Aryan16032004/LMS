import { Student } from "../models/student.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"

export const studentVerify = asyncHandler(async(req,res,next)=>{

   try {
     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
     
     if(!token){
         throw new ApiError(401,"Unauthorized request")
     }
 
     const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
     const student = await Student.findById(decodedToken?._id).select(
         "-password -refreshToken"
     )
 
     if(!student){
         // discuss about frontend
         throw new ApiError(401,"Invalid acccess token")
     }
 
     req.user=student;
     next()
   } catch (error) {
     throw new ApiError(401, error?.message || "invalid access token")
   }
 })