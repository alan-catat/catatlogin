import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation'

export default async function LogoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    // redirect ke halaman signin jika user tidak ditemukan
    redirect('/')
  }else{  
    let { error } = await supabase.auth.signOut()
    if (!error) {
      redirect('/logout')
    }
  }
}
