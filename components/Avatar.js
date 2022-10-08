import supabase from 'libs/supabase'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from 'styles/Avatar.module.css'
import PhotoIcon from 'ui/PhotoIcon'

export default function Avatar () {
  const [avatar, setAvatar] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    getDataUser()
  }, [])

  const getDataUser = async () => {
    const user = supabase.auth.user()

    const { error, data, status } = await supabase.from('profiles')
      .select('avatar')
      .eq('id', user.id)
      .single()

    if (error && status !== 406) throw error
    if (data) downloadFile(data.avatar)
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

  const updatePhoto = async event => {
    const user = supabase.auth.user()

    try {
      setUploading(true)
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (error) throw error

      const updates = {
        id: user.id,
        avatar: filePath,
        updated_at: new Date()
      }
      sendFile(updates)
    } catch (error) {
      console.log(error)
    } finally {
      setUploading(false)
    }
  }

  const sendFile = async data => {
    try {
      const { error } = await supabase.from('profiles').upsert(data)
      if (error) throw error
      getDataUser()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={styles.content}>
      <span className={styles.title}>avatar</span>

      <section className={styles.form}>
        <article className={styles.photo}>
          { avatar
            ? <Image src={avatar} alt='photo profile' layout='fill' />
            : <PhotoIcon className={styles.photo_icon} />
          }
        </article>

        <article className={styles.options}>
          <label className={styles.label}>
            <input className={styles.label_input} onChange={updatePhoto} type='file' accept='image/*' />
            {uploading ? 'uploading ...' : 'upload photo'}
          </label>
          <button className={styles.delete}>remove photo</button>
        </article>
      </section>
    </div>
  )
}
