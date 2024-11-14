import { Student } from "../models/student.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Class } from "../models/class.model.js";
import { Course } from "../models/course.model.js";
import { Topic } from "../models/topic.model.js";

const generateAccessAndRefreshToken = async (studentId) => {
    try {
        const student = await Student.findById(studentId);

        if (!student) {
            throw new ApiError(404, "Student not found");
        }

        const accessToken = student.generateAccessToken();
        const refreshToken = student.generateRefreshToken();

        student.refreshToken = refreshToken; // Save the refresh token in the student record
        await student.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Unable to generate access and refresh token");
    }
};

const loginStudent = asyncHandler(async (req, res) => {
    const { userId, password } = req.body;
    console.log(req.body);
    
    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    // Find student by userId
    const student = await Student.findOne({ userId });

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    // Validate password
    const isPasswordValid = await student.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Incorrect password");
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(student._id);

    // Retrieve logged-in student's details excluding sensitive fields
    const loggedInUser = await Student.findById(student._id).select("-password -refreshToken");

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
            }, "Student logged in successfully")
        );
});

const getCurrentStudent = asyncHandler(async (req, res) => {
    // Ensure the user is authenticated
    if (!req.user) {
        throw new ApiError(401, "Not authenticated");
    }

    // Retrieve the current student's details excluding sensitive fields
    const currentStudent = await Student.findById(req.user._id).select("-password -refreshToken");

    return res.status(200)
        .json(new ApiResponse(200, currentStudent, "Current student fetched successfully"));
});

const getStudentClass = asyncHandler(async (req, res) => {
    const studentId = req.user._id;
    const student = await Student.findById(studentId).select("class");

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    return res.status(200).json(new ApiResponse(200, student.class, "Student class fetched successfully"));
});

const getClassDetail = asyncHandler(async (req, res) => {
    const { classId } = req.params;

    if (!classId) {
        throw new ApiError(400, "Class ID is required");
    }

    const student = await Student.findById(req.user._id);

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    const classDetail = await Class.findById(classId);

    if (!classDetail || classDetail._id.toString() !== student.class.toString()) {
        throw new ApiError(404, "Class not found");
    }

    return res.status(200).json(
        new ApiResponse(200, classDetail, "Class detail fetched successfully")
    );
});

const getStudentCourses = asyncHandler(async (req, res) => {
    const studentId = req.user._id;
    const student = await Student.findById(studentId).select("class");

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    const courses = await Course.find({ classes: student.class });

    if (!courses || courses.length === 0) {
        throw new ApiError(404, "No courses found for this class");
    }

    return res.status(200).json(new ApiResponse(200, courses, "Student courses fetched successfully"));
});

const getAllTopics = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate("topics");

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    const topics = course.topics;

    return res.status(200).json(new ApiResponse(200, topics, "Topics fetched successfully"));
});

const getTopic = asyncHandler(async (req, res) => {
    const { topicId } = req.params;

    const topic = await Topic.findById(topicId)
    if (!topic) {
        throw new ApiError(404, "Topic not found");
    }

    return res.status(200).json(new ApiResponse(200, topic ,"Topic retrieved successfully"));
});

const logOutStudent = asyncHandler(async (req, res) => {
    // Clear the refresh token for the student
    await Student.findByIdAndUpdate(
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
        .json(new ApiResponse(200, {}, "Student logged out successfully"));
});

const toggleTopicCompletion = asyncHandler(async (req, res) => {
    const { topicId } = req.params;

    if (!topicId) {
        throw new ApiError(400, "Topic ID is required");
    }

    // Find the topic by ID
    const topic = await Topic.findById(topicId);

    if (!topic) {
        throw new ApiError(404, "Topic not found");
    }

    // Toggle the complete status
    topic.complete = !topic.complete;
    await topic.save();

    return res.status(200).json(
        new ApiResponse(200, topic, `Topic completion status set to ${topic.complete}`)
    );
});


const studentProgress = asyncHandler(async (req, res) => {
    const studentId = req.user._id;
    const student = await Student.findById(studentId).select("class");

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    // Find all courses associated with the student's class
    const courses = await Course.find({ classes: student.class }).populate("topics");

    if (!courses || courses.length === 0) {
        throw new ApiError(404, "No courses found for this class");
    }

    // Calculate progress for each course
    const progressData = courses.map((course) => {
        const totalTopics = course.topics.length;
        const completedTopics = course.topics.filter((topic) => topic.complete).length;

        const progressPercentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

        return {
            courseId: course._id,
            courseName: course.name,
            totalTopics,
            completedTopics,
            progressPercentage: Math.round(progressPercentage * 100) / 100, // Rounding to 2 decimal places
        };
    });

    return res.status(200).json(
        new ApiResponse(200, progressData, "Student progress fetched successfully")
    );
});


export {getTopic,toggleTopicCompletion,studentProgress, loginStudent, getCurrentStudent, logOutStudent ,getStudentClass,getStudentCourses,getAllTopics,getClassDetail};
