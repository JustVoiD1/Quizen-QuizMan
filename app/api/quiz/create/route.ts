import {connectMongo} from '@/config/db';
import Quiz from '@/models/Quiz';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    const body = await req.json();

    const { title, questions } = body;

    const newQuiz = new Quiz({
      title,
      questions,
    });

    await newQuiz.save();

    return NextResponse.json({
      success: true,
      message: 'Quiz Created'
    });

  } catch (error) {
    console.error('Error creating quiz:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Something went wrong!'
    },
      {
        status: 500
      });
  }
}