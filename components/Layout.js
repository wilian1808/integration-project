import NavBar from './NavBar'
import styles from 'styles/Layout.module.css'

export default function Layout ({ children }) {
  return (
    <div className={styles.layout}>
      <NavBar />
      <main className={styles.main}>{children}</main>
    </div>
  )
}
