import supabase from 'libs/supabase'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from 'styles/Avatar.module.css'

export default function Avatar () {
  const [avatar, setAvatar] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    getDataUser()
  }, [])

  console.log('cambiando')

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
      // recive un objeto con los cambios
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
      {/* <h2 className={styles.title}>update avatar</h2> */}
      <section className={styles.avatar}>
        <div className={styles.photo}>
          { avatar
            ? <Image src={avatar} alt='photo profile' layout='fill' />
            : <svg className={styles.question} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g data-name="Layer 2">
                <g data-name="question-mark">
                  <rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"/>
                  <path d="M17 9A5 5 0 0 0 7 9a1 1 0 0 0 2 0 3 3 0 1 1 3 3 1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-1.1A5 5 0 0 0 17 9z"/>
                  <circle cx="12" cy="19" r="1"/>
                </g>
              </g>
            </svg>
          }
        </div>
        <div className={styles.options}>
          <label className={styles.label}>
            <input className={styles.label_input} onChange={updatePhoto} type='file' accept='image/*' />
            {/* change photo */}
            {uploading ? 'uploading ...' : 'upload photo'}
          </label>
          <button className={styles.delete}>remove photo</button>
        </div>
      </section>
    </div>
  )
}
