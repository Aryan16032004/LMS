import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const teacherSchema = new mongoose.Schema({
    name:{type:String,required:true},
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  Courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] ,
  refreshToken: {
    type: String,
  },
});

teacherSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
  });
  
  // Check password correctness
  teacherSchema.methods.isPasswordCorrect = async function (password) {

    return await bcrypt.compare(password, this.password);
  };

  teacherSchema.methods.generateAccessToken = function () {

    return jwt.sign(
      {
        _id: this._id,
        name: this.name,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
  };
  teacherSchema.methods.generateRefreshToken = function () {

    return jwt.sign(
      { _id: this._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
  };

export const Teacher = mongoose.model('Teacher', teacherSchema);

