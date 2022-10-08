import supabase from 'libs/supabase'
import { useState, useEffect, useContext } from 'react'
import Image from 'next/image'
import styles from 'styles/Avatar.module.css'
import PhotoIcon from 'ui/PhotoIcon'
import { ProfileContext } from 'context/profile'

export default function Avatar () {
  const [pathname, setPathname] = useState(null)
  const [removing, setRemoving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { avatar, setAvatar } = useContext(ProfileContext)

  useEffect(() => {
    downloadPhoto(avatar)
  }, [avatar])

  const updatePhoto = async event => {
    try {
      const user = supabase.auth.user()
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('you must select an image to upload')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (error) throw error

      const data = {
        id: user.id,
        avatar: filePath,
        updated_at: new Date()
      }

      sendFile(data)
    } catch (error) {
      console.log(error)
    } finally {
      setUploading(false)
    }
  }

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

  const deleteAvatar = async path => {
    try {
      setRemoving(true)
      const user = supabase.auth.user()

      const { error } = await supabase.storage
        .from('avatars')
        .remove([path])

      if (error) throw error

      const data = {
        id: user.id,
        avatar: null,
        updated_at: new Date()
      }

      sendFile(data)
    } catch (error) {
      console.log(error)
    } finally {
      setRemoving(false)
    }
  }

  const sendFile = async update => {
    try {
      const { error, data } = await supabase.from('profiles').upsert(update)
      if (error) throw error

      if (data) {
        const { avatar } = data.at(0)
        setAvatar(avatar)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={styles.content}>
      <span className={styles.title}>avatar</span>

      <section className={styles.form}>
        <article className={styles.photo}>
          { pathname
            ? <Image src={pathname} alt='photo profile' layout='fill' />
            : <PhotoIcon className={styles.photo_icon} />
          }
        </article>

        <article className={styles.options}>
          <label className={styles.label}>
            <input className={styles.label_input} onChange={updatePhoto} type='file' accept='image/*' />
            {uploading ? 'uploading ...' : 'upload photo'}
          </label>
          <button className={styles.delete} onClick={() => deleteAvatar(avatar)}>
            { removing ? 'removing...' : 'remove photo' }
          </button>
        </article>
      </section>
    </div>
  )
}
