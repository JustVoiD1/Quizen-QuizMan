import mongoose, { Connection } from "mongoose"

declare global {
  var mongoose: {
    conn: Connection | null,
    promise: Promise | null
  }
}

export interface QuestionType {
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizType {
  _id: mongoose.Types.ObjectId,
  createdBy: mongoose.Types.ObjectId
  title: string;
  questions: QuestionType[];
}

export interface QuestionResultType {
  questionIndex: number;
  question: string;
  correctAnswer: number;
  studentAnswer: number;
  isCorrect: boolean;
}

export interface SubmissionType {
  _id: mongoose.Types.ObjectId,

  studentName: string;
  quizId: {
    _id: mongoose.Types.ObjectId;
    title: string;
  } | string;
  studentId: mongoose.Types.ObjectId
  answers: number[];
}

export interface SelectedQuizType {
  id: string;
  title: string;
}

export interface GradedSubmissionType {
  success: boolean;
  score: number;
  totalQuestions: number;
  percentage: number;
  results: QuestionResultType[];
}


export interface UserType {
  _id: mongoose.Types.ObjectId,
  name: string,
  email: string,
  password: string,
  role: 'teacher' | 'student',
  createdAt: Date,
  updatedAt: Date,
}

export interface JWTPayloadType {
    userId: string,
    role : 'teacher' | 'student',
    email : string

}


export type ViewModeType = 'quizzes' | 'submissions';

export { };