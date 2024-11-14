import { getCurrentStudent, loginStudent, logOutStudent, getStudentClass, getStudentCourses, getAllTopics, getClassDetail, studentProgress, toggleTopicCompletion, getTopic, } from "../controller/student.controller.js";
import { studentVerify } from "../middleware/auth.student.js";
import { Router } from "express";

const router = Router();

router.route("/login").post(loginStudent);
router.route("/logout").post(studentVerify, logOutStudent);
router.route("/currentUser").get(studentVerify, getCurrentStudent);
router.route("/student-class").get(studentVerify, getStudentClass);
router.route("/student-courses").get(studentVerify, getStudentCourses);
router.route("/topics/:courseId").get(studentVerify, getAllTopics);
router.route("/topic/:topicId").get(studentVerify,getTopic);
router.route("/class-detail/:classId").get(studentVerify, getClassDetail);
router.route("/progress").get(studentVerify,studentProgress)
router.route("/topics/:topicId/toggle-completion").patch(studentVerify,toggleTopicCompletion)
export default router;
