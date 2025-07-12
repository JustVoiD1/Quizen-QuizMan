import { connectMongo } from '@/config/db';
import Submission from '@/models/Submission';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectMongo();
  
  try {
    const submissions = await Submission.find().populate('quizId', 'title');

    return NextResponse.json({ submissions });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Failed to fetch submissions' }, { status: 500 });
  }
}