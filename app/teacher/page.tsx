'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Page = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-3xl">Welcome to Teacher Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-muted-foreground text-lg">
            Manage your quizzes and check student submissions easily from here.
          </p>
          <div className="space-y-4">
            <Button asChild className="w-full h-12 text-lg">
              <Link href="/teacher/create/">Create Quiz</Link>
            </Button>
            <Button asChild variant="secondary" className="w-full h-12 text-lg">
              <Link href="/teacher/submissions/">View Submissions</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
