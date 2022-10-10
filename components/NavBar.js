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
  const [targetName, setTargetName] = useState(null)

  useEffect(() => {
    downloadPhoto(avatar)
    generateNameAvatar()
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

  const generateNameAvatar = () => {
    const user = supabase.auth.user()
    const fullname = user.user_metadata.full_name
    const response = fullname
      .split(' ')
      .at(0)
      .slice(0, 2)
      .toUpperCase()

    setTargetName(response)
  }

  return (
    <header className={styles.navbar} >
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

          <button data-label={targetName} className={styles.profile}>
            { pathname && <Image src={pathname} alt='avatar user' layout='fill' /> }
          </button>
        </section>

      </div>
    </header>
  )
}
