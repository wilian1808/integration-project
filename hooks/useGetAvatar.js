import supabase from 'libs/supabase'

const useGetAvatar = async path => {
  try {
    const { error, data } = await supabase.storage
      .from('avatars')
      .download(path)

    if (error) throw error

    return { url: URL.createObjectURL(data) }
  } catch (error) {
    console.log(error)
  }
}

export default useGetAvatar
