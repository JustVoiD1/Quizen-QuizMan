import { connectMongo } from '@/config/db';
import Quiz from '@/models/Quiz';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest, { params }: { params: Promise<{ quizId: string }> }) {
  try {
    await connectMongo();
    
    const { quizId } = await params;

    if (!quizId) {
      return NextResponse.json({ 
        success: false,
        message: 'Quiz ID is required' 
      }, { status: 400 });
    }

    // Find the quiz by ID
    const quiz = await Quiz.findById(quizId);
    
    if (!quiz) {
      return NextResponse.json({ 
        success: false,
        message: 'Quiz not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      quiz: quiz 
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Error fetching quiz' 
    }, { status: 500 });
  }
}