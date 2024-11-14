import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Teacher } from "../models/teacher.model.js";
import { Course } from "../models/course.model.js";
import { Student } from "../models/student.model.js";
import { Class } from "../models/class.model.js";
import { Topic } from "../models/topic.model.js";
const generateAccessAndRefreshToken = async (studentId) => {
    try {
        const teacher = await Teacher.findById(studentId);

        if (!teacher) {
            throw new ApiError(404, "Teacher not found");
        }

        const accessToken = teacher.generateAccessToken();
        const refreshToken = teacher.generateRefreshToken();

        teacher.refreshToken = refreshToken; // Save the refresh token in the teacher record
        await teacher.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Unable to generate access and refresh token");
    }
};

const loginTeacher = asyncHandler(async (req, res) => {
    const { userId, password } = req.body;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    // Find teacher by userId
    const teacher = await Teacher.findOne({ userId });

    if (!teacher) {
        throw new ApiError(404, "Teacher not found");
    }

    // Validate password
    const isPasswordValid = await teacher.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Incorrect password");
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(teacher._id);

    // Retrieve logged-in teacher's details excluding sensitive fields
    const loggedInUser = await Teacher.findById(teacher._id).select("-password -refreshToken");

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
            }, "Teacher logged in successfully")
        );
});

const getCurrentTeacher = asyncHandler(async (req, res) => {
    // Ensure the user is authenticated
    if (!req.user) {
        throw new ApiError(401, "Not authenticated");
    }

    // Retrieve the current student's details excluding sensitive fields
    const currentTeaccher = await Teacher.findById(req.user._id).select("-password -refreshToken");

    return res.status(200)
        .json(new ApiResponse(200, currentTeaccher, "Current teacher fetched successfully"));
});


const getTeacherCourses = asyncHandler(async(req,res)=>{
    const {teacherId} = req.params

    const teacher = await Teacher.findById(teacherId).populate({
        path:'Courses',
        model:Course
    })

    if (!teacher) {
        throw new ApiError(404,'Teacher not found');
      }

      return res.status(200)
      .json(new ApiResponse(200,teacher.Courses,"Teacher Courses"))

})

const getCourseTopics= asyncHandler(async(req,res)=>{
    const {courseId} = req.params;

    const course= await Course.findById(courseId).populate("topics")

    if (!course) {
        throw new ApiError(400,"Course Not found")
    }

    const topics=course.topics

    return res.status(200).json(new ApiResponse(200, topics, "Topics fetched successfully"));
})

const getTopic = asyncHandler(async (req, res) => {
    const { topicId } = req.params;

    const topic = await Topic.findById(topicId)
    if (!topic) {
        throw new ApiError(404, "Topic not found");
    }

    return res.status(200).json(new ApiResponse(200, topic ,"Topic retrieved successfully"));
});

const getCourseStudents =asyncHandler(async (req,res)=>{
    const {courseId} = req.params
    const course = await Course.findById(courseId).populate("classes","_id")

    if(!course){
        throw new ApiError(404, "Course not found")
    }
    const classesId= course.classes
    // const className=await Class.findById(classesId[0])

    // const student= await Student.find({"class":classesId[0]})
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

const logOutTeacher = asyncHandler(async (req, res) => {
    // Clear the refresh token for the teacher
    await Teacher.findByIdAndUpdate(
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
        .json(new ApiResponse(200, {}, "Teacher logged out successfully"));
});

export {getTopic,loginTeacher,logOutTeacher,getCurrentTeacher,getTeacherCourses,getCourseTopics,getCourseStudents}