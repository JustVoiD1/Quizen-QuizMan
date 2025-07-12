import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: Number },
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [questionSchema],
});

const Quiz = mongoose.models.Quiz || mongoose.model('quizzes', quizSchema);

export default Quiz;