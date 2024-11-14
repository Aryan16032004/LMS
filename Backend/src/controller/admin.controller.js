import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Teacher } from "../models/teacher.model.js";
import { Course } from "../models/course.model.js";
import { Student } from "../models/student.model.js";
import { Class } from "../models/class.model.js";
import { Admin } from "../models/admin.model.js";

const generateAccessAndRefreshToken = async (studentId) => {
    try {
        const admin = await Admin.findById(studentId);

        if (!admin) {
            throw new ApiError(404, "Admin not found");
        }

        const accessToken = admin.generateAccessToken();
        const refreshToken = admin.generateRefreshToken();

        admin.refreshToken = refreshToken; // Save the refresh token in the admin record
        await admin.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Unable to generate access and refresh token");
    }
};

const loginAdmin = asyncHandler(async (req, res) => {
    const { userId, password } = req.body;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    // Find admin by userId
    const admin = await Admin.findOne({ userId });

    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }

    // Validate password
    const isPasswordValid = await admin.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Incorrect password");
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(admin._id);

    // Retrieve logged-in admin's details excluding sensitive fields
    const loggedInUser = await Admin.findById(admin._id).select("-password -refreshToken");

    // Set cookies for access and refresh tokens
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser,
                accessToken,
                refreshToken,
            }, "Admin logged in successfully")
        );
});

const getCurrentAdmin = asyncHandler(async (req, res) => {
    // Ensure the user is authenticated
    if (!req.user) {
        throw new ApiError(401, "Not authenticated");
    }

    // Retrieve the current student's details excluding sensitive fields
    const currentTeaccher = await Admin.findById(req.user._id).select("-password -refreshToken");

    return res.status(200)
        .json(new ApiResponse(200, currentTeaccher, "Current admin fetched successfully"));
});

const getAllTeachers =asyncHandler(async(req,res)=>{
    const teachers =await Teacher.find({},{name:1})

    return res.status(200)
    .json(new ApiResponse(200,teachers,"All teachers"))

})

const getTeacherCourses = asyncHandler(async(req,res)=>{
    const {teacherId} = req.params

    const courses = ((await Teacher.findById(teacherId).populate("Courses")).Courses)

    if (!courses) {
        throw new ApiError(404,'courses not found');
      }
      let arr=[]
      for(let i =0;i<courses.length;i++){
        arr.push({
            id:courses[i].id,
            name:courses[i].name
        })
      }
      return res.status(200)
      .json(new ApiResponse(200,arr,"Teacher Courses"))
})

const getCourseStudents =asyncHandler(async (req,res)=>{
    const {courseId} = req.params
    const course = await Course.findById(courseId).populate("classes","_id")

    if(!course){
        throw new ApiError(404, "Course not found")
    }
    const classesId= course.classes
    let arr = {};

    for (let i = 0; i < classesId.length; i++) {
        const students = await Student.find({ "class": classesId[i] });
        const classObj = await Class.findById(classesId[i]);
        const className = classObj.name; 
    
        arr[className] = []; 
    
        for (let j = 0; j < students.length; j++) {
            arr[className].push(students[j].name); 
        }
    }
    
    return res.status(200).json(new ApiResponse(200,arr,"Students fetch Succesfully"))
})


const logoutAdmin = asyncHandler(async(req,res)=>{
    await Admin.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        }, {
        new: true
    });

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Admin logged out successfully"));
})
export  { loginAdmin, getCurrentAdmin,logoutAdmin,getAllTeachers,getTeacherCourses ,getCourseStudents};
