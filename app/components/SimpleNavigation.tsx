'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SimpleNavigation() {
  const { user, signout } = useAuth();

  console.log(user)
  if (!user) return null;

  return (
    <div className="bg-white border-b p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href={user.role === 'teacher' ? '/teacher' : '/student'}>
          <h1 className="text-xl font-bold">Quizen</h1>
        </Link>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm">Welcome, {user.name}</span>
          <Button variant="destructive" size="sm" onClick={signout}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}