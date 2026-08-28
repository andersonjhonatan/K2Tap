import { ImageResponse } from 'next/og'

export const alt = 'K2 Tap — Um toque. Uma conexão.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 72,
        background: '#f4f7fa',
        color: '#07111f',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 720 }}>
        <div
          style={{
            display: 'flex',
            color: '#146ef5',
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 3,
          }}
        >
          K2 TAP • NFC INTELIGENTE
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 28,
            fontSize: 94,
            fontWeight: 850,
            letterSpacing: -7,
            lineHeight: 0.92,
          }}
        >
          <span>Um toque.</span>
          <span>Uma conexão.</span>
        </div>
        <div style={{ display: 'flex', marginTop: 30, color: '#5d6877', fontSize: 27 }}>
          Experiências digitais personalizadas para negócios.
        </div>
      </div>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          width: 290,
          height: 410,
          alignItems: 'center',
          justifyContent: 'center',
          border: '10px solid #07111f',
          borderRadius: 52,
          background: 'linear-gradient(150deg,#0b1f39,#146ef5)',
          boxShadow: '0 35px 80px rgba(7,17,31,.24)',
          color: 'white',
          fontSize: 68,
          fontWeight: 900,
        }}
      >
        K2
      </div>
    </div>,
    size,
  )
}
