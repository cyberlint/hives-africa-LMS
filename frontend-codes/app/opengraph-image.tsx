import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'NextHive | Pan-African AI School';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// ... existing imports and config

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#262226',
          background: 'radial-gradient(circle at 50% 50%, #FDB606 0%, #262226 70%)',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Hex Pattern Overlay - FIXED with explicit width/height */}
        <img
          src="https://nexthive-lms.t3.storage.dev/Brand%20Identity/hex-pattern.png"
          alt=""
          width="1440" // Provide base dimensions (120% of 1200)
          height="756" // Provide base dimensions (120% of 630)
          style={{
            position: 'absolute',
            width: '120%',
            height: '120%',
            top: '-10%',
            left: '-10%',
            objectFit: 'cover',
            opacity: 0.05,
          }}
        />

        {/* Logo Container */}
        <div
          style={{
            display: 'flex',
            background: '#FDB606',
            borderRadius: '50%',
            padding: '35px',
            marginBottom: '25px',
            boxShadow: '0 0 60px rgba(253,182,6,0.6)',
          }}
        >
          <img
            src="https://nexthive-lms.t3.storage.dev/Brand%20Identity/NextHive%20Logo%20-%20Orange%20BG.png"
            width="180"
            height="180"
            alt="NextHive Logo"
          />
        </div>

        {/* Brand Text */}
        <h1
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: 'white',
            margin: 0,
            textAlign: 'center',
          }}
        >
          NextHive
        </h1>

        <p
          style={{
            fontSize: 32,
            fontWeight: 500,
            color: '#FDB606',
            marginTop: 12,
            textAlign: 'center',
          }}
        >
          The Pan-African AI School
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}