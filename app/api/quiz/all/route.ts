import  {connectMongo}  from '@/config/db';
import Quiz from '@/models/Quiz';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectMongo();
    const quizzes = await Quiz.find();
    return NextResponse.json({ quizzes });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json({ message: 'Failed to fetch quizzes' }, { status: 500 });
  }
}