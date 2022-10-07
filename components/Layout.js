import NavBar from './NavBar'
import Sidebar from './Sidebar'
import styles from 'styles/Layout.module.css'

export default function Layout ({ children }) {
  return (
    <main className={styles.layout}>
      <Sidebar />
      <section>
        <NavBar />
        <div className={styles.content}>
          { children }
        </div>
      </section>
    </main>
  )
}
