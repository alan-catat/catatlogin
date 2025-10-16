import SignInForm from '@/components/auth/SignInForm';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation'

export default async function SignInPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    redirect('/dashboard-admin')
  }
  return <SignInForm  redirectTo="/dashboard-admin" />
}
