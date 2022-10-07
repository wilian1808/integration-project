import supabase from 'libs/supabase'
import { useEffect, useState } from 'react'
import Avatar from './Avatar'

export default function Account ({ session }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar, setAvatar] = useState(null)

  useEffect(() => {
    getProfile()
  }, [])

  const getCurrentUser = async () => {
    const { data: { session }, error } = await supabase.auth.session()
    if (error) throw error
    if (!session?.user) throw new Error('user not logged in')

    return session.user
  }

  const getProfile = async () => {
    try {
      setLoading(true)
      const user = await getCurrentUser()

      const { data, error, status } = await supabase.from('profiles')
        .select('username, website, avatar_url')
        .eq('id', user.id)
        .single()

      if (error && status !== 406) throw error

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatar(data.avatar_url)
      }
    } catch (error) {
      console.log(error)
      console.log('este es el error')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async ({ username, website, avatar }) => {
    try {
      setLoading(true)
      const user = await getCurrentUser()

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url: avatar,
        updated_at: new Date()
      }

      const { error } = await supabase.from('profiles').upsert(updates)
      if (error) throw error
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-widget">

      {/* start */}
      <Avatar
        url={avatar}
        size={200}
        onUpload={url => {
          setAvatar(url)
          updateProfile({ username, website, avatar })
        }}
      />
      {/* end */}

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" disabled />
      </div>
      <div>
        <label htmlFor="username">Name</label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="website"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button primary block"
          onClick={() => updateProfile({ username, website, avatar })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <button
          className="button block"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
