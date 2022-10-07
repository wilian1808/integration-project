import { useEffect } from 'react'
import { useRouter } from 'next/router'
import supabase from 'libs/supabase'
import 'styles/globals.css'
import { AuthProvider } from 'context/auth'

export default function MyApp ({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      await fetch('/api/auth', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({ event, session })
      })

      if (event === 'SIGNED_IN') router.push('/profile')
      if (event === 'SIGNED_OUT') router.push('/login')
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [router])

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}
