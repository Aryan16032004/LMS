// // seeds.js

// import mongoose from "mongoose";
// import { Class } from "./src/models/class.model.js";
// import { Admin } from "./src/models/admin.model.js";
// import { Teacher } from "./src/models/teacher.model.js";
// import { Student } from "./src/models/student.model.js";
// import { Course } from "./src/models/course.model.js";
// import { Topic } from "./src/models/topic.model.js";

// mongoose.connect('mongodb+srv://Aryan:Aryan123@cluster0.oen15.mongodb.net/LMS');

// // Generate Random ID helper functions
// const generateRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// async function seedData() {
//   // Clear existing data
//   await Class.deleteMany({});
//   await Student.deleteMany({});
//   await Teacher.deleteMany({});
//   await Course.deleteMany({});
//   await Topic.deleteMany({});
//   await Admin.deleteMany({}); // Clear Admin data

//   // Step 1: Create Admin
//   const admin = new Admin({
//     name: 'Saurabh',
//     userId: 'A9999', // Fixed Admin ID
//     password: 'adminPassword123' // Set a password for admin
//   });
//   await admin.save();

//   // Step 2: Create 5 Classes
//   const classes = [];
//   for (let i = 1; i <= 5; i++) {
//     const newClass = new Class({ name: `Class ${i}`, classid: String(i).padStart(2, '0'), courses: [] });
//     await newClass.save();
//     classes.push(newClass);
//   }

//   // Step 3: Create Teachers and Assign them to Classes
//   const teachersData = [];
//   for (let i = 1; i <= 5; i++) {
//     teachersData.push({
//       name: `Teacher ${i}`,
//       userId: `T${String(i).padStart(4, '0')}`, // Generate IDs T0001 to T0005
//       password: 'teacherPassword123',
//       classes: []
//     });
//   }

//   const teachers = await Teacher.insertMany(teachersData);

//   // Step 4: Create Courses and Assign to Classes and Teachers
//   const coursesData = [
//     { name: 'English', teacher: teachers[0], classIds: [1, 2, 3] },
//     { name: 'Maths', teacher: teachers[3], classIds: [3, 4, 5] },
//     { name: 'Science', teacher: teachers[1], classIds: [3, 4, 5] },
//     { name: 'Art', teacher: teachers[4], classIds: [1, 2, 4, 5] },
//     { name: 'History', teacher: teachers[2], classIds: [1, 2] }
//   ];

//   for (const courseData of coursesData) {
//     const { name, teacher, classIds } = courseData;
//     for (const classId of classIds) {
//       const currentClass = classes[classId - 1];
//       const newCourse = new Course({
//         name,
//         class: currentClass._id,
//         complete: false,
//         teacher: teacher._id
//       });
//       await newCourse.save();

//       // Step 5: Assign Course to Class and Teacher
//       currentClass.courses.push(newCourse._id);
//       teacher.classes.push(currentClass._id);

//       // Step 6: Add Topics to the Course
//       for (let i = 1; i <= 2; i++) {
//         const newTopic = new Topic({
//           title: `${name} Topic ${i}`,
//           description: `${name} Course Description for Topic ${i}`,
//           content: `Content for ${name} Topic ${i}`,
//           course: newCourse._id
//         });
//         await newTopic.save();
//         newCourse.topics.push(newTopic._id);
//       }
//       await newCourse.save();
//     }
//     await teacher.save();
//   }

//   // Step 7: Create Students and Assign to Classes
//   const studentNames = [
//     // Class 1
//     'John Doe', 'Alice Brown', 'Tom Smith', 'Sara White', 'Chris Black',
//     // Class 2
//     'Michael Green', 'Emma Davis', 'Liam Wilson', 'Sophia Taylor', 'Mason Anderson',
//     // Class 3
//     'James Thomas', 'Isabella Martin', 'Benjamin Harris', 'Charlotte Lewis', 'Lucas Clark',
//     // Class 4
//     'Ethan Lee', 'Amelia Walker', 'Alexander Hall', 'Mia Young', 'Jacob Allen',
//     // Class 5
//     'Henry King', 'Olivia Wright', 'Sebastian Scott', 'Ava Hill', 'Daniel Adams'
//   ];

//   for (let i = 0; i < studentNames.length; i++) {
//     const currentClass = classes[Math.floor(i / 5)]; // 5 students per class
//     const randomNumber = generateRandomNumber(1111, 9998); // Random number between 1111 and 9998
//     const newStudent = new Student({
//       name: studentNames[i],
//       userId: `S${currentClass.classid}${randomNumber}`, // S+ClassID+RandomNumber
//       password: 'studentPassword123', // Same password for all students
//       class: currentClass._id
//     });
//     await newStudent.save();
//   }

//   console.log('Data seeded successfully!');
//   mongoose.connection.close();
// }

// seedData();







// ****************************************************************************************




import mongoose from "mongoose";
import { Class } from "./src/models/class.model.js";
import { Admin } from "./src/models/admin.model.js";
import { Teacher } from "./src/models/teacher.model.js";
import { Student } from "./src/models/student.model.js";
import { Course } from "./src/models/course.model.js";
import { Topic } from "./src/models/topic.model.js";

mongoose.connect('mongodb+srv://Aryan:Aryan123@cluster0.oen15.mongodb.net/LMS');

const generateRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function seedData() {
  // Clear previous data
  await Class.deleteMany({});
  await Student.deleteMany({});
  await Teacher.deleteMany({});
  await Course.deleteMany({});
  await Topic.deleteMany({});
  await Admin.deleteMany({});

  // Seed admin
  const admin = new Admin({
    name: 'Saurabh',
    userId: 'A9999',
    password: 'adminPassword123'
  });
  await admin.save();

  // Seed classes
  const classes = [];
  for (let i = 1; i <= 5; i++) {
    const newClass = new Class({ name: `Class ${i}`, classid: String(i).padStart(2, '0'), courses: [] });
    await newClass.save();
    classes.push(newClass);
  }

  // Seed teachers
  const teachersData = [];
  for (let i = 1; i <= 5; i++) {
    const teacher = new Teacher({
      name: `Teacher ${i}`,
      userId: `T${String(i).padStart(4, '0')}`, 
      password: 'teacherPassword123',
      Courses: [] 
    });
    await teacher.save(); 
    teachersData.push(teacher);
  }

 // Seed courses
const coursesData = [
  { name: 'English', teacher: teachersData[0], classIds: [1, 2, 3] },
  { name: 'Maths', teacher: teachersData[3], classIds: [3, 4, 5] },
  { name: 'Science', teacher: teachersData[1], classIds: [3, 4, 5] },
  { name: 'Art', teacher: teachersData[4], classIds: [1, 2, 4, 5] },
  { name: 'History', teacher: teachersData[2], classIds: [1, 2] }
];

// Store unique courses to track topics created
const uniqueCourses = new Set();

for (const courseData of coursesData) {
  const { name, teacher, classIds } = courseData;
  
  // Ensure topics are added for only 5 unique courses
  if (!uniqueCourses.has(name)) {
    uniqueCourses.add(name);  // Mark this course as unique
    
    const newCourse = new Course({
      name,
      classes: [], // Initialize classes array
      complete: false,
      teacher: teacher._id
    });
    
    // Add course to classes
    for (const classId of classIds) {
      const currentClass = classes[classId - 1];
      newCourse.classes.push(currentClass._id);
      currentClass.courses.push(newCourse._id);
    }
    
    await newCourse.save();
    
    // Create 2 topics for each unique course
    for (let i = 1; i <= 2; i++) {
      const newTopic = new Topic({
        title: `${name} Topic ${i}`,
        description: `${name} Course Description for Topic ${i}`,
        content: `Content for ${name} Topic ${i}`,
        course: newCourse._id
      });
      await newTopic.save();
      newCourse.topics.push(newTopic._id);
    }
    await newCourse.save();
    
    // Save the teacher after adding courses
    teacher.Courses.push(newCourse._id);
    await teacher.save();
  }
}
  // Seed students
  const studentNames = [
    'John Doe', 'Alice Brown', 'Tom Smith', 'Sara White', 'Chris Black',
    'Michael Green', 'Emma Davis', 'Liam Wilson', 'Sophia Taylor', 'Mason Anderson',
    'James Thomas', 'Isabella Martin', 'Benjamin Harris', 'Charlotte Lewis', 'Lucas Clark',
    'Ethan Lee', 'Amelia Walker', 'Alexander Hall', 'Mia Young', 'Jacob Allen',
    'Henry King', 'Olivia Wright', 'Sebastian Scott', 'Ava Hill', 'Daniel Adams'
  ];

  for (let i = 0; i < studentNames.length; i++) {
    const currentClass = classes[Math.floor(i / 5)];
    const randomNumber = generateRandomNumber(1111, 9998);
    const newStudent = new Student({
      name: studentNames[i],
      userId: `S${currentClass.classid}${randomNumber}`,
      password: 'studentPassword123',
      class: currentClass._id
    });
    await newStudent.save();
  }

  console.log('Data seeded successfully!');
  mongoose.connection.close();
}

seedData();




