import supabase from 'libs/supabase'
import { createContext, useEffect, useState } from 'react'

export const ProfileContext = createContext()

export const ProfileProvider = ({ children }) => {
  const [username, setUsername] = useState('')
  const [fullname, setFullname] = useState('')
  const [avatar, setAvatar] = useState(null)

  useEffect(() => {
    getDataProfile()
  }, [])

  const getDataProfile = async () => {
    try {
      const user = supabase.auth.user()

      const { error, status, data } = await supabase
        .from('profiles')
        .select('username, fullname, avatar')
        .eq('id', user.id)
        .single()

      if (error && status !== 406) throw error
      if (data) {
        data.avatar && setAvatar(data.avatar)
        data.username && setUsername(data.username)
        data.fullname && setFullname(data.fullname)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ProfileContext.Provider value={{ username, fullname, avatar, setUsername, setFullname, setAvatar }}>
      { children }
    </ProfileContext.Provider>
  )
}
