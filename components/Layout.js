import NavBar from './NavBar'
import styles from 'styles/Layout.module.css'
import { ProfileProvider } from 'context/profile'

export default function Layout ({ children }) {
  return (
    <ProfileProvider>
      <div className={styles.layout}>
        <NavBar />
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </ProfileProvider>
  )
}
