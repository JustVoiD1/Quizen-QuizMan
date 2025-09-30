'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { SubmissionType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import ProtectedPage from '@/app/components/ProtectedPage';
import SimpleNavigation from '@/app/components/SimpleNavigation';

export default function TeacherSubmissionsPage() {
  const router = useRouter();
  const { quizId } = useParams(); // Get quizId from URL
  const [submissions, setSubmissions] = useState<SubmissionType[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [grading, setGrading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (quizId) {
      setLoading(true);
      axios
        .get(`/api/quiz/submissions?id=${quizId}`)
        .then((res) => {
          setSubmissions(res.data.submissions);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [quizId]);

  const handleAnswerChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...correctAnswers];
    newAnswers[index] = e.target.value;
    setCorrectAnswers(newAnswers);
  };

  const handleGrade = (studentIndex: number) => {
    const studentSubmission = submissions[studentIndex];
    const score = studentSubmission.answers.reduce((total: number, answer: number, index: number) => {
      return total + (answer.toString() === correctAnswers[index] ? 1 : 0);
    }, 0);

    alert(`Student: ${studentSubmission.studentName} \nScore: ${score}/${correctAnswers.length}`);
  };

  const handleFinalGrade = () => {
    setGrading(true);
    // Send the correct answers to grade all submissions
    axios
      .post(`/api/quiz/check`, { studentAnswers: submissions.map(s => s.answers), correctAnswers })
      .then(() => {
        alert('Grading Complete!');
        setGrading(false);
      })
      .catch((err) => {
        console.error(err);
        setGrading(false);
      });
  };

  return (
    <ProtectedPage allowedRole='teacher'>
      <SimpleNavigation />
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Student Submissions</CardTitle>
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => router.back()}>
                  ← Back to Quizzes
                </Button>
              </div>
            </CardHeader>
          </Card>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} className="h-32 w-full rounded-md" />
              ))}
            </div>
          ) : submissions.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-muted-foreground text-lg">No submissions yet!</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Correct Answers Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Enter Correct Answers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {submissions[0].answers.map((_, idx) => (
                    <div key={idx} className="space-y-2">
                      <Label htmlFor={`answer-${idx}`}>
                        Correct Answer for Question {idx + 1}
                      </Label>
                      <Input
                        id={`answer-${idx}`}
                        value={correctAnswers[idx] || ''}
                        onChange={(e) => handleAnswerChange(idx, e)}
                        placeholder={`Correct answer for Q${idx + 1}`}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Submissions Grid */}
              <div className="grid gap-6 center md:grid-cols-2">
                {submissions.map((submission, idx) => (
                  <Card key={idx} className="transition-shadow hover:shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg">{submission.studentName}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-muted-foreground">Student Answers:</h4>
                        {submission.answers.map((answer, qIdx) => (
                          <div key={qIdx} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                            <span className="font-medium">Q{qIdx + 1}:</span>
                            <span className="text-sm">Option {answer + 1}</span>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={() => handleGrade(idx)}
                        className="w-full"
                        variant="secondary"
                      >
                        Grade Submission
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Final Grade Button */}
              <Card>
                <CardContent className="flex justify-center py-6">
                  <Button
                    onClick={handleFinalGrade}
                    disabled={grading}
                    size="lg"
                    className="px-8"
                  >
                    {grading ? 'Grading...' : 'Grade All Submissions'}
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </ProtectedPage>
  );
}
