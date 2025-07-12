'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { QuestionType, QuizType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';



export default function StudentQuizPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        if (quizId) {
          const res = await axios.get(`/api/quiz/${quizId}`);
          console.log('API response:', res.data); // Debug log
          if (res.data && res.data.success && res.data.quiz) {
            setQuiz(res.data.quiz);
            setAnswers(new Array(res.data.quiz.questions.length).fill(null));
          } else {
            console.error('Quiz data not found or API returned error:', res.data);
          }
        }
      } catch (err) {
        console.error('Error fetching quiz:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <Skeleton className="h-8 w-64 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-12 w-full" />
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, oIdx) => (
                    <Skeleton key={oIdx} className="h-8 w-full" />
                  ))}
                </div>
              </div>
            ))}
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-3xl">
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-muted-foreground text-lg">Quiz not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAnswerChange = (index: number, value: number) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const confirmSubmission = window.confirm("Are you sure you want to submit your answers?")
    if(!confirmSubmission) return;
    
    try {
      await axios.post('/api/submission/create', {
        quizId,
        studentName,
        answers,
      });
      alert('Answers submitted successfully!');
      router.push("/student");

    } catch (err) {
      console.error(err);
      alert('Failed to submit answers.');
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">{quiz.title}</CardTitle>
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => router.back()}>
                ← Back to Quizzes
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Quiz Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Name */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Student Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="studentName">Your Name</Label>
                <Input
                  id="studentName"
                  placeholder="Enter your name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          {quiz.questions.map((q: QuestionType, idx: number) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="text-lg">Question {idx + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base font-medium">{q.text}</p>
                
                <RadioGroup
                  value={answers[idx]?.toString() ?? ''}
                  onValueChange={(val) => handleAnswerChange(idx, parseInt(val))}
                >
                  {q.options.map((opt: string, oIdx: number) => (
                    <div key={oIdx} className="flex items-center space-x-2">
                      <RadioGroupItem value={oIdx.toString()} id={`q-${idx}-opt-${oIdx}`} />
                      <Label htmlFor={`q-${idx}-opt-${oIdx}`} className="cursor-pointer">
                        {opt}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}

          {/* Submit Button */}
          <Card>
            <CardContent className="flex justify-center py-6">
              <Button type="submit" size="lg" className="px-12">
                Submit Answers
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}