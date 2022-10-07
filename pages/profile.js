import Layout from 'components/Layout'
import Avatar from 'components/Avatar'
import styles from 'styles/Profile.module.css'

export default function Profile () {
  const updateProfile = async event => {
    event.preventDefault()
  }

  return (
    <Layout>
      <section className={styles.content}>
        <Avatar />

        <form className={styles.form} autoComplete='off' onSubmit={updateProfile}>
          <label className={styles.form_label}>
            Fullname
            <span className={styles.form_span}>*</span>
            <input className={styles.form_input} type='text' name='fullname' placeholder='Fullname' />
          </label>
          <label className={styles.form_label}>
            Username
            <span className={styles.form_span}>*</span>
            <input className={styles.form_input} type='text' name='username' placeholder='Username' />
          </label>
          <input className={styles.form_submit} type='submit' value='update' />
        </form>

      </section>
    </Layout>
  )
}
