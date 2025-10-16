import { Metadata } from 'next'
import DashboardClient from './DashboardClient'
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: "FINANCIAL-EXTRACTOR | DASHBOARD",
}

export default async  function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // redirect ke halaman signin jika user tidak ditemukan
    redirect('/auth/dashboard-user/signin')
  }

  return <DashboardClient />
}
