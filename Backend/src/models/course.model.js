import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],  
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }], 
  complete: { type: Boolean, default: false }
});

export const Course = mongoose.model('Course', courseSchema);