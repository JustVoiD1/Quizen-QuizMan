import { connectMongo } from '@/config/db';
import Submission from '@/models/Submission';
import Quiz from '@/models/Quiz';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectMongo();
    
    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get('id');

    if (!quizId) {
      return NextResponse.json({ 
        message: 'Quiz ID is required' 
      }, { status: 400 });
    }

    // Find submissions for specific quiz and populate quiz title
    const submissions = await Submission.find({ quizId: quizId }).populate('quizId', 'title');
    
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error fetching quiz submissions:', error);
    return NextResponse.json({ 
      message: 'Error fetching submissions' 
    }, { status: 500 });
  }
}