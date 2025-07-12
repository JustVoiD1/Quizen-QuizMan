import { Connection } from "mongoose"

declare global {
    var mongoose : {
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
  _id: string;
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
  _id: string;
  studentName: string;
  quizId: {
    _id: string;
    title: string;
  } | string;
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




export type ViewModeType = 'quizzes' | 'submissions';

export{};