
import express from "express"

import cookieParser from "cookie-parser"

const app = express();



app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


import studentrouter from "./routes/student.route.js"
import teacherrouter from "./routes/teacher.route.js"
import adminrouter from "./routes/admin.route.js"

app.use("/api/v1/student", studentrouter)
app.use("/api/v1/teacher", teacherrouter)
app.use("/api/v1/admin",adminrouter)

export { app }