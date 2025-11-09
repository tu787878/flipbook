'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Signup disabled - Admin account is created via environment variables
export default function SignUpDisabled() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to signin
    router.push('/auth/signin');
  }, [router]);

  return null;
}
