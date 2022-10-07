import supabase from 'libs/supabase'
import { useEffect, useState } from 'react'
import styles from 'styles/NavBar.module.css'
import Image from 'next/image'

export default function NavBar () {
  const [avatar, setAvatar] = useState(null)

  useEffect(() => {
    getAvatar()
  }, [])

  const getAvatar = async () => {
    const user = supabase.auth.user()
    // obtenemos los datos
    try {
      const { error, data, status } = await supabase.from('profiles')
        .select('avatar')
        .eq('id', user.id)
        .single()

      if (error && status !== 406) throw error
      if (data) downloadFile(data.avatar)
    } catch (error) {
      console.log(error)
    }
  }

  const downloadFile = async path => {
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .download(path)

      if (error) throw error
      setAvatar(URL.createObjectURL(data))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <header className={styles.navbar}>
      <button className={styles.button}>
        <svg className={styles.button_icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
          <path d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" />
        </svg>
      </button>

      <section className={styles.options}>
        <button className={styles.notification}>
          <svg className={styles.notification_icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z" />
          </svg>
        </button>

        <button data-label="WC" className={styles.options_fullname}>
          { avatar && <Image src={avatar} alt='avatar user' layout='fill' /> }
        </button>

      </section>
    </header>
  )
}
