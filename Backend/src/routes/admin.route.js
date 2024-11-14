import { getAllTeachers, getCourseStudents, getCurrentAdmin, getTeacherCourses, loginAdmin, logoutAdmin } from "../controller/admin.controller.js";
import { adminVerify } from "../middleware/auth.admin.js";
import { Router } from "express";

const router = Router();

router.route("/login").post(loginAdmin);
router.route("/currentUser").get(adminVerify,getCurrentAdmin)
router.route("/logout").post(adminVerify,logoutAdmin)
router.route("/all-teachers").get(adminVerify,getAllTeachers)
router.route("/teacher-courses/:teacherId").get(adminVerify,getTeacherCourses)
router.route("/course-students/:courseId").get(adminVerify,getCourseStudents)


export default router;
