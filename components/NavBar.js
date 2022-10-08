import supabase from 'libs/supabase'
import { useEffect, useState } from 'react'
import styles from 'styles/NavBar.module.css'
import Image from 'next/image'
import Link from 'next/link'
import SchoolIcon from 'ui/SchoolIcon'
import BellIcon from 'ui/BellIcon'

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
      <div className={styles.navbar_content}>

        <Link href='/profile'>
          <a className={styles.navbar_title}>
            <SchoolIcon className={styles.navbar_icon} />
            school.dev
          </a>
        </Link>

        <section className={styles.options}>
          <button className={styles.notification}>
            <BellIcon className={styles.notification_icon} />
          </button>

          <button data-label="WC" className={styles.profile}>
            { avatar && <Image src={avatar} alt='avatar user' layout='fill' /> }
          </button>
        </section>

      </div>
    </header>
  )
}
