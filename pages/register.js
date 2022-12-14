import Header from 'components/Header'
import supabase from 'libs/supabase'
import GoogleIcon from 'ui/GoogleIcon'
import signInWithProvider from 'libs/signInWithProvider'
import Head from 'next/head'
import styles from 'styles/register.module.css'
import Link from 'next/link'
import { useState } from 'react'
import SpotifyIcon from 'ui/SpotifyIcon'

export default function Register () {
  const [loading, setLoading] = useState(false)
  const [valid, setValid] = useState(false)
  const [success, setSuccess] = useState(false)
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('the password does not match')

  const validatePassword = event => {
    setValid(true)
    setMessage('the password does not match')
    if (password === event.target.value) {
      setValid(false)
    }
  }

  const signUPWithEmailAndPassword = async event => {
    event.preventDefault()

    const email = event.target.email.value
    const password = event.target.password.value
    const confirm = event.target.confirm.value

    try {
      setLoading(true)
      setValid(false)
      setSuccess(false)

      if (password !== confirm) throw new Error('las contraseñas no coinciden')
      const { user, error } = await supabase.auth.signUp({ email, password })

      if (error) throw error

      if (user.identities.length === 0) {
        setMessage('email already used')
        setValid(true)
        throw new Error('email already used')
      }

      if (user.identities.length === 1) {
        event.target.email.value = ''
        event.target.confirm.value = ''
        setPassword('')
        setMessage('confirm your email')
        setSuccess(true)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Head>
        <meta name="theme-color" content="#0a0a0a" />
        <title>Schooldev - Register</title>
      </Head>

      <Header />
      <div className={styles.content}>
        <section className={styles.card}>
          <h2 className={styles.title}>Sign Up</h2>

          <form autoComplete='off' onSubmit={signUPWithEmailAndPassword} className={styles.form}>
            <label className={styles.form_label}>
              Email
              <span className={styles.form_span}>*</span>
              <input className={styles.form_input} type='email' name='email' placeholder='Email' required />
            </label>
            <label className={styles.form_label}>
              Password
              <span className={styles.form_span}>*</span>
              <input value={password} onChange={e => setPassword(e.target.value)} className={styles.form_input} minLength='6' type='password' name='password' placeholder='Password' required />
            </label>
            <label className={styles.form_label}>
              Confirm Password
              <span className={styles.form_span}>*</span>
              <input onKeyUp={validatePassword} className={styles.form_input} type='password' name='confirm' placeholder='Confirm Password' required />
              { valid &&
                <span className={styles.form_alert}>{message}</span>
              }
              { success &&
                <span className={styles.form_success}>{message}</span>
              }
            </label>
            <input disabled={loading} className={styles.form_submit} type='submit' value='Register' />
          </form>

          <h3 className={styles.subtitle}>or</h3>

          <section className={styles.options}>
            <button onClick={() => signInWithProvider('google')} className={styles.button}>
              <GoogleIcon className={styles.button_icon} />
              Google
            </button>
            <button onClick={() => signInWithProvider('spotify')} className={styles.button}>
              <SpotifyIcon className={styles.button_icon} />
              spotify
            </button>
          </section>
        </section>

        <Link href='/login'>
          <a className={styles.login}>Already have an account? Login</a>
        </Link>
      </div>
    </div>
  )
}
