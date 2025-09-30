
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  SubmissionType, 
  QuizType, 
  SelectedQuizType, 
  GradedSubmissionType, 
  ViewModeType 
} from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ProtectedPage from '../../components/ProtectedPage';
import SimpleNavigation from '../../components/SimpleNavigation';

export default function SubmissionsPage() {
//   const [submissions, setSubmissions] = useState<SubmissionType[]>([]);
  const [quizzes, setQuizzes] = useState<QuizType[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<SelectedQuizType | null>(null);
  const [quizSubmissions, setQuizSubmissions] = useState<SubmissionType[]>([]);
  const [gradedSubmissions, setGradedSubmissions] = useState<Record<string, GradedSubmissionType>>({});
  const [loadingGrades, setLoadingGrades] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<ViewModeType>('quizzes');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/quiz/all');
        setQuizzes(res.data.quizzes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const fetchQuizSubmissions = async (quizId: string, quizTitle: string) => {
    try {
      const res = await axios.get(`/api/quiz/submissions?id=${quizId}`);
      setQuizSubmissions(res.data.submissions);
      setSelectedQuiz({ id: quizId, title: quizTitle });
      setViewMode('submissions');
    } catch (err) {
      console.error('Error fetching quiz submissions:', err);
      alert('Failed to fetch quiz submissions');
    }
  };

  const goBackToQuizzes = () => {
    setViewMode('quizzes');
    setSelectedQuiz(null);
    setQuizSubmissions([]);
    setGradedSubmissions({});
  };

  const checkSubmission = async (submissionId: string, quizId: string) => {
    setLoadingGrades(prev => ({ ...prev, [submissionId]: true }));
    
    try {
      const res = await axios.post('/api/quiz/check', {
        quizId,
        submissionId
      });
      
      if (res.data.success) {
        setGradedSubmissions(prev => ({
          ...prev,
          [submissionId]: res.data
        }));
      }
    } catch (err) {
      console.error('Error checking submission:', err);
      alert('Failed to check submission');
    } finally {
      setLoadingGrades(prev => ({ ...prev, [submissionId]: false }));
    }
  };

  return (
    <ProtectedPage allowedRole="teacher">
      <SimpleNavigation />
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl text-center">
                {viewMode === 'quizzes' ? 'Quiz Submissions' : `${selectedQuiz?.title} - Submissions`}
              </CardTitle>
            {viewMode === 'submissions' && (
              <div className="flex justify-center">
                <Button variant="outline" onClick={goBackToQuizzes}>
                  ← Back to Quizzes
                </Button>
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Quiz Selection View */}
        {viewMode === 'quizzes' && (
          <>
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-32 w-full rounded-md" />
                ))}
              </div>
            ) : quizzes.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground text-lg">No quizzes available.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {quizzes.map((quiz) => (
                  <Card
                    key={quiz._id.toString()}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50"
                    onClick={() => fetchQuizSubmissions(quiz._id.toString(), quiz.title)}
                  >
                    <CardHeader>
                      <CardTitle className="text-xl">{quiz.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4">
                        {quiz.questions?.length || 0} question&#40;s&#41;
                      </p>
                      <div className="text-primary font-medium text-sm">
                        Click to view submissions →
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Submissions View */}
        {viewMode === 'submissions' && (
          <>
            {quizSubmissions.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground text-lg">No submissions for this quiz yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {quizSubmissions.map((submission) => {
                  const isGraded = gradedSubmissions[submission._id.toString()];
                  const isLoading = loadingGrades[submission._id.toString()];
                  
                  return (
                    <Card key={submission._id.toString()} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{submission.studentName}</CardTitle>
                            <p className="text-muted-foreground mt-1">
                              Quiz: <span className="italic">
                                {typeof submission.quizId === 'object' ? submission.quizId.title : selectedQuiz?.title}
                              </span>
                            </p>
                          </div>
                          
                          <Button
                            onClick={() => checkSubmission(
                              submission._id.toString(), 
                              typeof submission.quizId === 'object' ? submission.quizId._id.toString() : selectedQuiz?.id.toString() || ''
                            )}
                            disabled={isLoading}
                            variant={isGraded ? "secondary" : "default"}
                            size="sm"
                          >
                            {isLoading ? 'Checking...' : isGraded ? 'Re-check' : 'Check & Grade'}
                          </Button>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Results Section */}
                        {isGraded && (
                          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <h3 className="font-semibold text-green-800 mb-3">Results:</h3>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div className="text-center">
                                <div className="font-medium text-muted-foreground">Score</div>
                                <div className="text-lg font-bold text-green-600">
                                  {isGraded.score}/{isGraded.totalQuestions}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium text-muted-foreground">Percentage</div>
                                <div className={`text-lg font-bold text-green-600` }>
                                  {isGraded.percentage}%
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium text-muted-foreground">Grade</div>
                                <div className={`text-lg font-bold ${
                                  isGraded.percentage >= 90 ? 'text-green-600' :
                                  isGraded.percentage >= 80 ? 'text-blue-600' :
                                  isGraded.percentage >= 70 ? 'text-yellow-600' :
                                  'text-red-600'
                                }`}>
                                  {isGraded.percentage >= 90 ? 'A' :
                                   isGraded.percentage >= 80 ? 'B' :
                                   isGraded.percentage >= 70 ? 'C' :
                                   isGraded.percentage >= 60 ? 'D' : 'F'}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Answers Section */}
                        <div>
                          <h4 className="font-semibold mb-3">Student Answers:</h4>
                          <div className="space-y-2">
                            {submission.answers.map((ans, idx) => {
                              const questionResult = isGraded?.results?.[idx];
                              return (
                                <div key={idx} className={`flex justify-between items-center p-2 rounded ${
                                  questionResult ? 
                                    (questionResult.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200')
                                    : 'bg-muted/50'
                                }`}>
                                  <span className="font-medium">Q{idx + 1}:</span>
                                  <div className="flex items-center gap-2">
                                    
                                    <span className={questionResult ? (questionResult.isCorrect ? 'text-green-400' : 'text-red-400') : ""  }>Option {ans + 1}</span>
                                    {questionResult && (
                                      <span>
                                        {questionResult.isCorrect ? '' : `(Correct: ${questionResult.correctAnswer + 1})`}
                                      </span>
                                    )}
                                    
                                    
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </ProtectedPage>
  );
}