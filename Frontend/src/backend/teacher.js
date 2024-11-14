import axios from "axios";

export class TeacherService {
    
    // Fetch the currently logged-in teacher's details
    async getCurrentTeacher() {
        try {
            const response = await axios.get(`/api/v1/teacher/currentUser`);
            console.log("Current Teacher:", response.data.data);
            return response.data.data;
        } catch (error) {
            console.log("Error fetching current teacher:", error);
            throw error;
        }
    }

    // Fetch courses for a specific teacher by their ID
    async getTeacherCourses(teacherId) {
        try {
            const response = await axios.get(`/api/v1/teacher/${teacherId}/courses`);
            console.log("Teacher Courses:", response.data.data);
            return response.data.data;
        } catch (error) {
            console.log("Error fetching teacher's courses:", error);
            throw error;
        }
    }

    async getTopicsByCourseId(courseId) {
        try {
            const response = await axios.get(`/api/v1/teacher/course/${courseId}`);
            // console.log("Course Topics:", response.data.data);
            return response.data.data;
        } catch (error) {
            console.log("Error fetching course topics:", error);
            throw error;
        }
    }

    async getTopic(topicId) {
        try {
            const response = await axios.get(`/api/v1/teacher/topic/${topicId}`);
            // console.log("Course Topics:", response.data.data);
            return response.data.data;
        } catch (error) {
            console.log("Error fetching  topic data:", error);
            throw error;
        }
    }

    async getCourseStudents(courseId) {
        try {
            const response = await axios.get(`/api/v1/teacher/students/${courseId}`);
            // console.log("Course Topics:", response.data.data);
            return response.data.data;
        } catch (error) {
            console.log("Error fetching  students data:", error);
            throw error;
        }
    }
}

const teacherService = new TeacherService();

export default teacherService;
