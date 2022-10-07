import supabase from './supabase'

const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.log(error)
  }
}

export default signOut
