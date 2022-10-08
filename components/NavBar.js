import supabase from 'libs/supabase'
import { useContext, useEffect, useState } from 'react'
import styles from 'styles/NavBar.module.css'
import Image from 'next/image'
import Link from 'next/link'
import SchoolIcon from 'ui/SchoolIcon'
import BellIcon from 'ui/BellIcon'
import { ProfileContext } from 'context/profile'

export default function NavBar () {
  const [pathname, setPathname] = useState(null)
  const { avatar } = useContext(ProfileContext)

  useEffect(() => {
    downloadPhoto(avatar)
  }, [avatar])

  const downloadPhoto = async path => {
    if (path) {
      try {
        const { data, error } = await supabase.storage
          .from('avatars')
          .download(path)

        if (error) throw error
        setPathname(URL.createObjectURL(data))
      } catch (error) {
        console.log(error)
      }
    } else {
      setPathname(null)
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
            { pathname && <Image src={pathname} alt='avatar user' layout='fill' /> }
          </button>
        </section>

      </div>
    </header>
  )
}
