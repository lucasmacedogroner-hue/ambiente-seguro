export interface ChatRoom {
  id: string
  is_private: boolean
  access_code: string | null
  created_by_session_id: string
  plan?: 'free' | 'premium'
  duration_hours?: number
  created_at: string
  expires_at: string
}

export interface Message {
  id: string
  room_id: string
  sender_name: string
  content: string | null
  image_url: string | null
  created_at: string
}

export interface AccessRequest {
  id: string
  room_id: string
  session_id: string
  user_name: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export type SkinId =
  | 'default'
  | 'whatsapp'
  | 'slack'
  | 'telegram'
  | 'discord'
  | 'teams'
export type ColorMode = 'light' | 'dark'
export type LayoutMode = 'bubble' | 'flat'
export type AvatarShape = 'round' | 'square'

export interface SkinVars {
  '--bg-main': string
  '--bg-sidebar': string
  '--bg-header': string
  '--bg-input': string
  '--bg-bubble-sent': string
  '--bg-bubble-received': string
  '--text-primary': string
  '--text-secondary': string
  '--text-bubble-sent': string
  '--text-bubble-received': string
  '--accent': string
  '--accent-fg': string
  '--border-color': string
  '--name-color': string
  '--header-fg': string
}

export type SkinChrome = 'default' | 'teams'

export interface Skin {
  id: SkinId
  name: string
  icon: string
  layout: LayoutMode
  avatarShape: AvatarShape
  /** Layout visual extra (ex.: barra lateral estilo Teams) */
  chrome?: SkinChrome
  light: SkinVars
  dark: SkinVars
}
