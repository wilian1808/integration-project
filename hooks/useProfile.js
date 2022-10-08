import { useEffect, useState } from 'react'
import supabase from 'libs/supabase'

const useProfile = () => {
  const [username, setUsername] = useState('')
  const [fullname, setFullname] = useState('')
  const [avatar, setAvatar] = useState(null)

  useEffect(() => {
    getDataUser()
  }, [])

  // funcion que obtiene los datos del perfil
  const getDataUser = async () => {
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

  // funcion que actualiza los datos del perfil
  const updateDataUser = async newData => {
    try {
      const { error, data } = await supabase
        .from('profiles')
        .upsert(newData)

      if (error) throw error
      if (data) {
        data.avatar && setAvatar(data.avatar)
        data.username && setUsername(data.username)
        data.fullname && setFullname(data.fullname)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return { username, fullname, avatar, updateDataUser }
}

export default useProfile
