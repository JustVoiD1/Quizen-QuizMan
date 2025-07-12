import {connectMongo} from '@/config/db';
import { QuestionResultType, QuestionType } from '@/lib/types';
import Quiz from '@/models/Quiz';
import Submission from '@/models/Submission';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req : NextRequest) {
  try {
    await connectMongo();
    const body = await req.json();
    const { quizId, submissionId } = body;

    if (!quizId || !submissionId) {
      return NextResponse.json({
        success: false,
        message: 'Quiz ID and Submission ID are required'
      }, { status: 400 });
    }

    // Get the quiz to access correct answers
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({
        success: false,
        message: 'Quiz not found'
      }, { status: 404 });
    }

    // Get the submission to access student answers
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return NextResponse.json({
        success: false,
        message: 'Submission not found'
      }, { status: 404 });
    }

    // Calculate score
    let score = 0;
    const totalQuestions = quiz.questions.length;
    const results : QuestionResultType[] = [];

    quiz.questions.forEach((question: QuestionType, index: number) => {
      const correctAnswer = question.correctAnswer;
      const studentAnswer = submission.answers[index];
      const isCorrect = studentAnswer === correctAnswer;
      
      if (isCorrect) {
        score++;
      }

      results.push({
        questionIndex: index,
        question: question.text,
        correctAnswer: correctAnswer,
        studentAnswer: studentAnswer,
        isCorrect: isCorrect
      });
    });

    const percentage = Math.round((score / totalQuestions) * 100);

    return NextResponse.json({
      success: true,
      score: score,
      totalQuestions: totalQuestions,
      percentage: percentage,
      results: results
    });

  } catch (error) {
    console.error('Error checking submission:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Something went wrong while checking submission'
    }, { status: 500 });
  }
}