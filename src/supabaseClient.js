import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // إجبار الحفظ
    storage: window.localStorage, // استخدام التخزين المحلي الصريح (الأكثر ثباتاً)
    autoRefreshToken: true, // تجديد الرمز تلقائياً
    detectSessionInUrl: true // التقاط الرابط عند العودة من الإيميل
  }
})
