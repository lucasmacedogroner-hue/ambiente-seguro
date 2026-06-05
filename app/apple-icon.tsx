import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          borderRadius: 40,
        }}
      >
        <svg
          width="180"
          height="180"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="64" height="64" rx="14" fill="#ffffff" />
          <path
            fill="#5B8DFA"
            d="M10 14h26c3.3 0 6 2.7 6 6v14c0 3.3-2.7 6-6 6h-8l-5 5v-5c-3.3 0-6-2.7-6-6V14z"
          />
          <path
            fill="#5B8DFA"
            d="M28 24h26c3.3 0 6 2.7 6 6v14c0 3.3-2.7 6-6 6h-8l-5 5v-5c-3.3 0-6-2.7-6-6V24z"
          />
        </svg>
      </div>
    ),
    { ...size },
  )
}
