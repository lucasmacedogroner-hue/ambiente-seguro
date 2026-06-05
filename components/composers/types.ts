import type { MessageComposerHandle } from '@/components/MessageComposer'

export interface SkinComposerProps {
  content: string
  sending: boolean
  uploading: boolean
  composerRef: React.RefObject<MessageComposerHandle | null>
  fileRef: React.RefObject<HTMLInputElement | null>
  onChange: (value: string) => void
  onSend: () => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
