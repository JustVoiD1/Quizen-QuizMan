import mongoose, { Schema } from 'mongoose';


const questionSchema = new Schema({
  text: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: Number },
});

const quizSchema = new Schema({
  title: { type: String, required: true },
  description: {type : String},
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required: true
  },
  questions: [questionSchema],
});

const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);

export default Quiz;