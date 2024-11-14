import axios from "axios";

export class StudentService {
    
    // Fetch the student's class
    async getStudentClass() {
        try {
            const response = await axios.get("/api/v1/student/student-class");
            // console.log("Student Class:", response.data.data);
            return response.data.data;
        } catch (error) {
            console.log("Error fetching student class:", error);
            throw error;
        }
    }

    // Fetch details of a specific class by ID
    async getClassDetailsById(classId) {
        try {
            const response = await axios.get(`/api/v1/student/class-detail/${classId}`);
            // console.log("Class Details:", response.data.data);
            return response.data.data;
        } catch (error) {
            console.log("Error fetching class details:", error);
            throw error;
        }
    }

    // Fetch all courses for the student
    async getStudentCourses() {
        try {
            const response = await axios.get("/api/v1/student/student-courses");
            // console.log("Student Courses:", response.data.data);
            return response.data.data;
        } catch (error) {
            console.log("Error fetching student courses:", error);
            throw error;
        }
    }

    // Fetch topics for a specific course by ID
    async getTopicsByCourseId(courseId) {
        try {
            const response = await axios.get(`/api/v1/student/topics/${courseId}`);
            // console.log("Course Topics:", response.data.data);
            return response.data.data;
        } catch (error) {
            console.log("Error fetching course topics:", error);
            throw error;
        }
    }

    async getTopic(topicId) {
        try {
            const response = await axios.get(`/api/v1/student/topic/${topicId}`);
            // console.log("Course Topics:", response.data.data);
            return response.data.data;
        } catch (error) {
            console.log("Error fetching  topic data:", error);
            throw error;
        }
    }
}

const studentService = new StudentService();

export default studentService;
