import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    youtubeLink: { type: String, default: null },  
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },  
    complete: { type: Boolean, default: false }
  });
  
 export  const Topic = mongoose.model('Topic', topicSchema);