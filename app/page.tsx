'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="text-center max-w-md w-full p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6">Welcome to the Quiz App</h1>
        <p className="text-lg mb-8">
          Start by creating a quiz as a teacher or take a quiz as a student!
        </p>
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/teacher/">Teacher Dashboard</Link>
          </Button>
          <Button asChild variant="secondary" className="w-full">
            <Link href="/student/">Student Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
