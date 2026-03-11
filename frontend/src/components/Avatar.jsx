const STYLES = [
  'avataaars', 'bottts', 'fun-emoji', 'lorelei', 'micah', 
  'miniavs', 'open-peeps', 'personas', 'pixel-art'
]

export const getAvatarUrl = (username, style = 'avataaars') => {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${username}&backgroundColor=b6e3f4,c0aede,d1d4f9`
}

export const AVATAR_STYLES = STYLES

const Avatar = ({ username, style = 'avataaars', size = 40, className = '' }) => {
  return (
    <img
      src={getAvatarUrl(username, style)}
      alt={username}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
    />
  )
}

export default Avatar
