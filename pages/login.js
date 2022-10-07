import Header from 'components/Header'
import supabase from 'libs/supabase'
import { useState } from 'react'
import AppleIcon from 'ui/AppleIcon'
import GoogleIcon from 'ui/GoogleIcon'
import signInWithProvider from 'libs/signInWithProvider'
import styles from 'styles/login.module.css'
import Link from 'next/link'

export default function Login () {
  const [valid, setValid] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const signInWithEmailAndPassword = async event => {
    event.preventDefault()
    const email = event.target.email.value
    const password = event.target.password.value

    try {
      setLoading(true)
      const { error } = await supabase.auth.signIn({ email, password })
      if (error) {
        setValid(!valid)
        setMessage(error.message)
        throw error
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header />
      <div className={styles.content}>
        <section className={styles.card}>
          <h2 className={styles.title}>Log In</h2>

          <form autoComplete='off' onSubmit={signInWithEmailAndPassword} className={styles.form}>
            <label className={styles.form_label}>
              Email
              <span className={styles.form_span}>*</span>
              <input className={styles.form_input} type='email' name='email' placeholder='Email' required />
            </label>
            <label className={styles.form_label}>
              Password
              <span className={styles.form_span}>*</span>
              <input className={styles.form_input} type='password' name='password' placeholder='Password' required />
              { valid &&
                <span className={styles.form_alert}>{message}</span>
              }
            </label>
            <input disabled={loading} className={styles.form_submit} type='submit' value='Log In' />
          </form>

          <h3 className={styles.subtitle}>or</h3>

          <section className={styles.options}>
            <button onClick={() => signInWithProvider('google')} className={styles.button}>
              <GoogleIcon className={styles.button_icon} />
              Google
            </button>
            <button onClick={() => signInWithProvider('apple')} className={styles.button}>
              <AppleIcon className={styles.button_icon} />
              Apple
            </button>
          </section>
        </section>

        <Link href='/register'>
          <a className={styles.register}>New? Sign Up</a>
        </Link>
      </div>
    </div>
  )
}
