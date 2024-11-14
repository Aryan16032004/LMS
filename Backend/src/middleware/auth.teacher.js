import { Teacher } from "../models/teacher.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"

export const teacherVerify = asyncHandler(async(req,res,next)=>{

   try {
     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
     
     if(!token){
         throw new ApiError(401,"Unauthorized request")
     }
 
     const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
     const teacher = await Teacher.findById(decodedToken?._id).select(
         "-password -refreshToken"
     )
 
     if(!teacher){
         // discuss about frontend
         throw new ApiError(401,"Invalid acccess token")
     }
 
     req.user=teacher;
     next()
   } catch (error) {
     throw new ApiError(401, error?.message || "invalid access token")
   }
 })