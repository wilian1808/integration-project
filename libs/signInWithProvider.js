import supabase from './supabase'

const signInWithProvider = async provider => {
  try {
    const { error } = await supabase.auth.signIn({ provider })
    if (error) throw error
  } catch (error) {
    console.log(error)
  }
}

export default signInWithProvider
