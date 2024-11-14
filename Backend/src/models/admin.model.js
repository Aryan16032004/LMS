import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const adminSchema = new mongoose.Schema({
    name:{type:String,required:true},
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: {
    type: String,
  },
});

adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
  });
  
  // Check password correctness
  adminSchema.methods.isPasswordCorrect = async function (password) {

    return await bcrypt.compare(password, this.password);
  };

  adminSchema.methods.generateAccessToken = function () {

    return jwt.sign(
      {
        _id: this._id,
        username: this.username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
  };
  adminSchema.methods.generateRefreshToken = function () {

    return jwt.sign(
      { _id: this._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
  };


export const Admin = mongoose.model('Admin', adminSchema);

