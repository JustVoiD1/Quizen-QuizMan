import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required : true
  },
  studentName: {
    type: String,
    required: true
  },
  answers: [
    {
      type: Number,
      required: true
    }
  ]
});

export default mongoose.models.Submission || mongoose.model('Submission', submissionSchema);