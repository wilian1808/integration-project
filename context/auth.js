import supabase from 'libs/supabase'
import { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    setSession(supabase.auth.session())
    setUser(supabase.auth.user())
  }, [])

  return (
    <AuthContext.Provider value={{ session, setSession, user, setUser }}>
      { children }
    </AuthContext.Provider>
  )
}
