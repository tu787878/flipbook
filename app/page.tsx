import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    // Redirect logged-in users to dashboard
    redirect('/dashboard');
  } else {
    // Redirect guests to login
    redirect('/auth/signin');
  }
  
  return null;
}
