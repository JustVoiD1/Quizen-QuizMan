'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { QuizType } from '@/lib/types';
import SimpleNavigation from '../components/SimpleNavigation';
import ProtectedPage from '../components/ProtectedPage';

export default function StudentDashboard() {
  const [quizzes, setQuizzes] = useState<QuizType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get('/api/quiz/all');
        setQuizzes(res.data.quizzes);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (<>
    <ProtectedPage allowedRole='student'>
      <SimpleNavigation />
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle className="text-center text-3xl">Available Quizzes</CardTitle>
            <p className="text-center text-muted-foreground">Select a quiz to get started</p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-20 w-full rounded-md" />
                ))}
              </div>
            ) : quizzes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No quizzes available at the moment.</p>
                <p className="text-muted-foreground text-sm mt-2">Check back later for new quizzes!</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {quizzes.map((quiz) => (
                  <Link key={quiz._id.toString()} href={`/student/${quiz._id}`}>
                    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/50">
                      <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
                        <p className="text-muted-foreground text-sm">
                          {quiz.questions?.length || 0} question&#40;s&#41;
                        </p>
                        <div className="mt-4 flex items-center text-primary text-sm font-medium">
                          Start Quiz →
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedPage>
  </>);
}