import { connectMongo } from '@/config/db';
import Submission from '@/models/Submission';  // (we'll create this model too!)
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  await connectMongo();
  
  try {
    const { quizId, studentName, studentId, answers } = await req.json();

    const submission = await Submission.create({
      quizId,
      studentId,
      studentName,
      answers
    });

    return NextResponse.json({ submission });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Failed to submit answers' }, { status: 500 });
  }
}