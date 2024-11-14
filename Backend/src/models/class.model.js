import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  classid:{type:String,required:true},
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]  
});

export const Class = mongoose.model('Class', classSchema);