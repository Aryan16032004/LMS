import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const studentSchema = new mongoose.Schema({
    name:{type:String,required:true},
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  refreshToken: {
    type: String,
  },
});

studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
  });
  
  // Check password correctness
  studentSchema.methods.isPasswordCorrect = async function (password) {

    return await bcrypt.compare(password, this.password);
  };

  studentSchema.methods.generateAccessToken = function () {

    return jwt.sign(
      {
        _id: this._id,
        username: this.username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
  };
  studentSchema.methods.generateRefreshToken = function () {

    return jwt.sign(
      { _id: this._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
  };
  
export const Student = mongoose.model('Student', studentSchema);
