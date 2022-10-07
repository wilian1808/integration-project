import supabase from 'libs/supabase'

export default async function handler (req, res) {
  supabase.auth.api.setAuthCookie(req, res)
}
