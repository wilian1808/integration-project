import Layout from 'components/Layout'
import Avatar from 'components/Avatar'
import styles from 'styles/Profile.module.css'
import { useEffect, useState } from 'react'
import supabase from 'libs/supabase'
import signOut from 'libs/signOut'
import Head from 'next/head'

export default function Profile () {
  const [fullname, setFullname] = useState('')
  const [username, setUsername] = useState('')
  const [avatar, setAvatar] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getData()
  }, [])

  // funcion que trae los datos por defecto
  const getData = async () => {
    try {
      const user = supabase.auth.user()

      const { error, data, status } = await supabase.from('profiles')
        .select('id, username, fullname, avatar')
        .eq('id', user.id)
        .single()

      if (error && status !== 406) throw error
      if (data) {
        data.avatar && setAvatar(data.avatar)
        data.username && setUsername(data.username)
        data.fullname && setFullname(data.fullname)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const updateProfile = async event => {
    event.preventDefault()
    try {
      setLoading(true)
      const user = supabase.auth.user()

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        username,
        fullname: fullname.toLowerCase(),
        updated_at: new Date()
      })

      if (error) throw error
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <Head>
        <meta name="theme-color" content="#0a0a0a" />
        <title>Schooldev - Profile</title>
      </Head>

      <section className={styles.profile}>
        <h2 className={styles.title}>
          Update Data Profile
        </h2>

        <Avatar path={avatar} />

        <form className={styles.form} autoComplete='off' onSubmit={updateProfile}>
          <label className={styles.form_label}>
            Fullname
            <span className={styles.form_span}>*</span>
            <input
              className={styles.form_input}
              value={fullname}
              onChange={e => setFullname(e.target.value)}
              type='text'
              name='fullname'
              placeholder='Fullname'
              spellCheck={false}
              required
            />
          </label>
          <label className={styles.form_label}>
            Username
            <span className={styles.form_span}>*</span>
            <input
              className={styles.form_input}
              value={username}
              onChange={e => setUsername(e.target.value)}
              type='text'
              name='username'
              placeholder='Username'
              spellCheck={false}
              required
            />
          </label>
          <input disabled={loading} className={styles.form_submit} type='submit' value='update' />
        </form>

        <div>
          <button onClick={() => signOut()} className={styles.logout}>
            logout
          </button>
        </div>

      </section>
    </Layout>
  )
}
