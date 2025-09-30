'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="text-center max-w-md w-full p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6">Welcome to Quizen</h1>
        <p className="text-lg mb-8">
          The ultimate quiz platform for teachers and students!
        </p>
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          <Button asChild variant="secondary" className="w-full">
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
        </div>
        <div className="mt-6 text-sm text-muted-foreground">
          <p>Teachers can create and manage quizzes</p>
          <p>Students can take quizzes and view results</p>
        </div>
      </div>
    </div>
  );
}