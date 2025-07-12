'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { QuestionType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function CreateQuizPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<QuestionType[]>([
    { text: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);

  const handleQuestionChange = (index: number, field: keyof QuestionType, value: string | number) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const updated = questions.filter((_, idx) => idx !== index);
      setQuestions(updated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/quiz/create', { title, questions });
      alert('Quiz Created Successfully!');
      router.push('/teacher');
    } catch (err) {
      console.error(err);
      alert('Something went wrong!');
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">Create a New Quiz</CardTitle>
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => router.back()}>
                ← Back to Dashboard
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quiz Title */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Quiz Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="title">Quiz Title</Label>
                <Input
                  id="title"
                  placeholder="Enter quiz title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          {questions.map((q, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Question {idx + 1}</CardTitle>
                  {questions.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeQuestion(idx)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`question-${idx}`}>Question Text</Label>
                  <Input
                    id={`question-${idx}`}
                    placeholder="Enter your question"
                    value={q.text}
                    onChange={(e) => handleQuestionChange(idx, 'text', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label>Options (Select the correct answer)</Label>
                  <RadioGroup
                    value={q.correctAnswer.toString()}
                    onValueChange={(value) => handleQuestionChange(idx, 'correctAnswer', parseInt(value))}
                  >
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center space-x-3">
                        <RadioGroupItem value={oIdx.toString()} id={`q${idx}-opt${oIdx}`} />
                        <Input
                          placeholder={`Option ${oIdx + 1}`}
                          value={opt}
                          onChange={(e) => handleOptionChange(idx, oIdx, e.target.value)}
                          required
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Action Buttons */}
          <Card>
            <CardContent className="flex justify-between items-center py-6">
              <Button
                type="button"
                variant="secondary"
                onClick={addQuestion}
              >
                Add Question
              </Button>

              <Button type="submit" size="lg" className="px-8">
                Create Quiz
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}