import { teacherVerify } from "../middleware/auth.teacher.js";
import { getCourseStudents, getCourseTopics, getCurrentTeacher, getTeacherCourses, getTopic, loginTeacher, logOutTeacher, } from "../controller/teacher.controller.js";
import { Router } from "express";

const router = Router();

router.route("/login").post(loginTeacher);
router.route("/logout").post(teacherVerify, logOutTeacher);
router.route("/currentUser").get(teacherVerify, getCurrentTeacher);
router.route('/:teacherId/courses').get(teacherVerify, getTeacherCourses);
router.route("/course/:courseId").get(teacherVerify,getCourseTopics)
router.route("/topic/:topicId").get(teacherVerify,getTopic)
router.route("/students/:courseId").get(teacherVerify,getCourseStudents)


export default router;
